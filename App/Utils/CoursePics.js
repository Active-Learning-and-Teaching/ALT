export const CoursePics = (imageNumber) => {

    let url = ""

    switch (imageNumber) {
        case 1:
            url = require('../Assets/1.jpeg');
            break;
        case 2:
            url = require('../Assets/2.jpeg');
            break;
        case 3:
            url = require('../Assets/3.jpeg');
            break;
        case 4:
            url = require('../Assets/4.jpeg');
            break;
        case 5:
            url = require('../Assets/5.jpeg');
            break;
        case 6:
            url = require('../Assets/6.jpeg');
            break;
        case 7:
            url = require('../Assets/7.jpeg');
            break;
        case 8:
            url = require('../Assets/8.jpeg');
    }

    return url
}
