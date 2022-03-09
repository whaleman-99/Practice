const axios = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const getHTML = async(keyword) => {
    try {
        return await axios.get("https://www.inflearn.com/courses?s=" + encodeURI(keyword))

    }catch(err) {
        console.log(err);

    }
}

const parsing = async (keyword) => {
    const html = await getHTML(keyword);
    const $ = cheerio.load(html.data);
    const $courseList = $(".course_card_item");

    let courses = [];
    $courseList.each((idx, node) => {
     const title = $(node).find(".course_title").text();
     courses.push({
        title: $(node).find(".course_title").text(),
        instructor: $(node).find(".instructor").text(),
        price: $(node).find(".price").text(),
        rating: $(node).find(".star_solid").css("width"),
        img: $(node).find(".card-image > figure > img").attr("src")
     })
    });
    //console.log(courses);
    console.log('parsing finish')
    saveData(courses);
}

const saveData = async (data) => {

    const csvWriter = createCsvWriter({
        path: './test.csv',
        header: [
            {id:'title', title:'제목'},
            {id:'instructor', title:'저자'},
            {id:'rating', title:'평점'},
            {id:'price', title:'가격'},
            {id:'img', title:'표지 이미지'},
        ]
    });

    csvWriter.writeRecords(data).then(()=>{
        console.log('csv save finish');
    });
}

parsing("자바스크립트");

