const { default: axios } = require('axios');
const express= require('express')
const router = express.Router()
const puppeteer = require("puppeteer");

router.get('/codechef/:user',async(req,res)=>{
    const userName=req.params.user;             //write a case for invalid user
    
    const outsideResponse = await axios.get(`https://codechef-api.vercel.app/${userName}`)
    
    if(!outsideResponse.success)
    res.json({
        success : false,
    }).status(404)
    else{
    
        const browser = await puppeteer.launch({headless : 'new'});
        const page = await browser.newPage();
        await page.goto(`https://www.codechef.com/users/${userName}`,{ viewport: { width: 1280, height: 720 }});

        const heatArray = await page.evaluate(()=>{
            const data=Array.from(document.querySelectorAll('#js-heatmap svg g g rect')).slice(-60);
            const points=data.map((element)=>{
                const date=element.getAttribute('data-date')
                const count=element.getAttribute('data-count')
                return {'count':count,'date':date}
            }).filter(element => element.count)
            return points
        })

        const qusetionsSolved=await page.evaluate(()=> {
            return document.querySelector(`[id^="highcharts-"] > svg > g.highcharts-data-labels.highcharts-series-0.highcharts-pie-series.highcharts-tracker > g.highcharts-label.highcharts-data-label.highcharts-data-label-color-0 > text > tspan`).textContent
        })

        var numberOfContests = await page.evaluate(()=>{
            return document.querySelector("body > main > div > div > div > div > div > section.rating-graphs.rating-data-section > div.rating-title-container > div > b").textContent
        })

        const lastFewRatings=await page.evaluate((numberOfContests)=>{
            var objArray=[]
            const graph = window.Highcharts.charts.find((chart) => chart.container.parentNode.id == 'cumulative-graph').series[0]
                for(var i=1;i<=5;i++){
                    if(numberOfContests-i<0)
                    break;
                    graph.points[numberOfContests-i].firePointEvent('click')
                    const contestRating=document.querySelector("#cumulative > div.rank-stats > div:nth-child(1) > div > a").textContent
                    const contestName=document.querySelector("#rating-box-all > div.contest-name > a").textContent
                    const contestDate=document.querySelector("#rating-box-all > div.contest-name > span").textContent
                    const contestGlobalRank=document.querySelector("#global-rank-all > strong").textContent
                    objArray.push({
                        "contestRating" : contestRating,
                        "contestName" : contestName,
                        "contestDate" : contestDate,
                        "contestGlobalRank" : contestGlobalRank
                    })
                }
                return objArray
        },numberOfContests)

        await browser.close()
        res.json({
            name : outsideResponse.data.name ,
            heatArray : heatArray ,
            qusetionsSolved : qusetionsSolved,
            numberOfContests : numberOfContests,
            lastFewRatings : lastFewRatings,
            otherCommon : outsideResponse.data
        })
    }
})

module.exports = router