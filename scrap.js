//https://codechef-api.vercel.app/akashh_bhandar
const user='nikola_tesla_7'
const puppeteer = require("puppeteer");

async function run(){
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto(`https://www.codechef.com/users/${user}`,{ viewport: { width: 1280, height: 720 }});

    // try this
    // await page.addScriptTag({ url: 'https://code.highcharts.com/modules/exporting.js' });
    // await page.addScriptTag({ url: 'https://code.highcharts.com/modules/export-data.js' });
    // await page.addScriptTag({ url: 'https://code.highcharts.com/modules/accessibility.js' });
    
    
    // heatMap done
    // const heatArray = await page.evaluate(()=>{
    //     const data=Array.from(document.querySelectorAll('#js-heatmap svg g g rect')).slice(-60);
    //     const points=data.map((element)=>{
    //         const date=element.getAttribute('data-date')
    //         const count=element.getAttribute('data-count')
    //         return {'count':count,'date':date}
    //     }).filter(element => element.count)
    //     return points
    // })
    // console.log(heatArray)

    //questionssolved
    // const qusetionsSolved=await page.evaluate(()=> {
    //     return document.querySelector("#highcharts-ljkniqf-49 > svg > g.highcharts-data-labels.highcharts-series-0.highcharts-pie-series.highcharts-tracker > g.highcharts-label.highcharts-data-label.highcharts-data-label-color-0 > text > tspan").innerHTML
    // })
    
    // console.log(qusetionsSolved)

    //numberofContests done
    var numberOfContests = await page.evaluate(()=>{
        return document.querySelector("body > main > div > div > div > div > div > section.rating-graphs.rating-data-section > div.rating-title-container > div > b").textContent
    })
    // console.log(numberOfContests)

    //last 5 ratings
    const lastFewRatings=async()=>{
        const objArray=[]
        const graph=Highcharts.charts.find((chart) => chart.container.parentNode.id == 'cumulative-graph').series[0]
        for(let i=0;i<5;i++){
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
        console.log(objArray)
    }



    lastFewRatings()
    // const lastRatings = await page.evaluate((numberOfContests,page)=>{
    //     console.log('start')
    //     const objArray=[]
    //     for(i=0;i<5;i++){
    //         if(numberOfContests-i<1)
    //         break;
    //         const performClick = async(i)=>{
    //             const selector=`[id^="highcharts-"] > svg > g.highcharts-series-group > g.highcharts-markers.highcharts-series-0.highcharts-line-series.highcharts-tracker > path:nth-child(${numberOfContests - i})`
    //             await page.waitFor(() => document.querySelector(selector))
    //             console.log("aka")
    //             // page.waitForSelector(selector,{timeout : 5000}).then(()=>{
    //             //     console.log('selecter =',numberOfContests - i)
    //             //     // const contestPointer=document.querySelector(selector)
    //             //     // console.log(contestPointer)
                //    contestPointer.click()
    //             // })
    //             // const handler=await page.$(selector)
    //             // await handler.screenshot({ path: `${i}.png` })
    //         }
    //         performClick(i)


    //         // const contestRating=document.querySelector("#cumulative > div.rank-stats > div:nth-child(1) > div > a").textContent
    //         // const contestName=document.querySelector("#rating-box-all > div.contest-name > a").textContent
    //         // const contestDate=document.querySelector("#rating-box-all > div.contest-name > span").textContent
    //         // const contestGlobalRank=document.querySelector("#global-rank-all > strong").textContent
    //         // objArray.push({
    //         //     "contestRating" : contestRating,
    //         //     "contestName" : contestName,
    //         //     "contestDate" : contestDate,
    //         //     "contestGlobalRank" : contestGlobalRank
    //         // })
    //     }
    //     console.log(objArray)
    //     return objArray
    // },numberOfContests,page)
    
    // await browser.close()
}

run()