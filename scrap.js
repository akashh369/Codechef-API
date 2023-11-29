//https://codechef-api.vercel.app/akashh_bhandar
const user='nikola_tesla_7'
const puppeteer = require("puppeteer");

async function run(){
    const browser = await puppeteer.launch({headless : 'new'});
    const page = await browser.newPage();
    await page.goto(`https://www.codechef.com/users/${user}`,{ viewport: { width: 1280, height: 720 }});

    // heatMap done
    const heatArray = await page.evaluate(()=>{
        const data=Array.from(document.querySelectorAll('#js-heatmap svg g g rect')).slice(-60);
        const points=data.map((element)=>{
            const date=element.getAttribute('data-date')
            const count=element.getAttribute('data-count')
            return {'count':count,'date':date}
        }).filter(element => element.count)
        return points
    })
    // console.log(heatArray)

    // questionssolved done
    const qusetionsSolved=await page.evaluate(()=> {
         return document.querySelector(`[id^="highcharts-"] > svg > g.highcharts-data-labels.highcharts-series-0.highcharts-pie-series.highcharts-tracker > g.highcharts-label.highcharts-data-label.highcharts-data-label-color-0 > text > tspan`).textContent
    })
    // console.log(qusetionsSolved)

    //numberofContests done
    var numberOfContests = await page.evaluate(()=>{
        return document.querySelector("body > main > div > div > div > div > div > section.rating-graphs.rating-data-section > div.rating-title-container > div > b").textContent
    })
    // console.log(numberOfContests)

    //last 5 ratings done
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
    // console.log(lastFewRatings)

    await browser.close()
}

run()