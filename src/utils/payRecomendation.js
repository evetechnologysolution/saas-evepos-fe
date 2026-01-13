const payRecommendation = ({ initial = 0, results = [], index = 0 }) => {
    if (typeof initial === 'undefined') {
        throw new Error('Parameter "initial" diperlukan.');
    }

    const scaled = Math.floor(initial / 1000);
    const thousand = 1000;

    const mod10 = scaled % 10;
    const mod50 = scaled % 50;
    const mod100 = scaled % 100;
    let calculation = 0;

    if (mod10 >= 5 && mod10 > 0) {
        if (index > 1) {
            if (mod100 >= 50) {
                calculation = (scaled + (100 - mod100)) * thousand;
            } else if (mod50 >= 20) {
                calculation = (scaled + (50 - mod50)) * thousand;
            } else {
                calculation = (scaled + (10 - mod10)) * thousand;
            }
        } else {
            calculation = (scaled + (10 - mod10)) * thousand;
        }
    } else {
        calculation = (scaled + (5 - mod10)) * thousand;
    }

    if (mod100 === 0) {
        return results;
    }
    if (results.length < 4) {
        results.push(calculation);
        // return payRecommendation({ initial: calculation, results: results, index: index + 1 });
    }

    return results;
}

export default payRecommendation;
