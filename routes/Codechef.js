const { default: axios } = require('axios');
const express = require('express')
const router = express.Router()
const puppeteer = require("puppeteer");
require("dotenv").config()

router.get('/codechef', async (req, res) => {
    res.json({
        success: false,
        result: "You are at right endpoint just add /handle_of_user at the end of url",
        example: "https://codechefapi.onrender.com/codechef/akashh_bhandar"
    }).status(200)
})

router.get('/codechef/:user', async (req, res) => {
    const userName = req.params.user;             //write a case for invalid user

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '-disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--disable-web-security'
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),//usr/bin/google-chrome-stable
    });

    const outsideResponse = await axios.get(`https://codechef-api.vercel.app/${userName}`);
    try {
        const page = await browser.newPage();
        await page.goto(`https://www.codechef.com/users/${userName}`, { viewport: { width: 1280, height: 720 } });
        const questionsSolved = await page.evaluate(() => {
            questionsSolved = document.querySelector("body > main > div > div > div > div > div > section.rating-data-section.problems-solved ").lastElementChild.textContent;
            questionsSolved = questionsSolved.split(":")[1];
            return questionsSolved;
        })

        const heatArray = await page.evaluate(() => {
            const data = Array.from(document.querySelectorAll('#js-heatmap svg g g rect')).slice(-60);
            const heatArray = data.map((element) => {
                const date = element.getAttribute('data-date')
                const count = element.getAttribute('data-count')
                return { 'count': count ? count : 0, 'date': date }
            });
            const tri = document.querySelector("body > main > div > div > div > div > div > section.rating-graphs.rating-data-section > div.rating-title-container > div > b").textContent;
            return heatArray;
        })

        const { numberOfContests, lastFewRatings } = await page.evaluate(() => {
            let numberOfContests = document.querySelector("body > main > div > div > div > div > div > section.rating-graphs.rating-data-section > div.rating-title-container > div > b").textContent;
            numberOfContests = parseInt(numberOfContests);

            document.querySelector("#graph-button-all").click();
            var lastFewRatings = []
            console.log('window.Highcharts', window.Highcharts, window);
            const graph = window.Highcharts.charts.find((chart) => chart.container.parentNode.id == 'cumulative-graph').series[0];
            for (var i = 1; i <= 10; i++) {
                if (numberOfContests - i < 0)
                    break;
                graph.points[numberOfContests - i].firePointEvent('click')
                const contestRating = document.querySelector("#cumulative > div.rank-stats > div:nth-child(1) > div > a").textContent
                const contestName = document.querySelector("#rating-box-all > div.contest-name > a").textContent
                const contestDate = document.querySelector("#rating-box-all > div.contest-name > span").textContent
                const contestGlobalRank = document.querySelector("#global-rank-all > strong").textContent
                lastFewRatings.push({
                    "contestRating": contestRating,
                    "contestName": contestName,
                    "contestDate": contestDate.substring(1, contestDate.length - 1),
                    "contestGlobalRank": contestGlobalRank
                })
            }

            return { heatArray, questionsSolved, numberOfContests, lastFewRatings };
        })


        res.json({
            success: true,
            name: outsideResponse.data.name,
            heatArray: heatArray,
            questionsSolved: questionsSolved,
            numberOfContests: numberOfContests,
            lastFewRatings: lastFewRatings,
            otherCommon: outsideResponse.data
        }).status(200);

    }
    catch (e) {
        if (e.name == "TypeError")
            e.name = "USER NOT FOUND"
        res.json(
            {
                success: false,
                error: "please enter a valid username eg akashh_bhandar",
                errorMessage: e.message,
                stack: e.stack,
            }).status(404);
    }
    finally {
        await browser.close();
    }
})

module.exports = router