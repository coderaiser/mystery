const mystery = require('.');
const {map, filter, take, append} = mystery;
const mapper = mystery([
    map((a) => a * a),
    filter((a) => a > 10),
    take(2),
    append(['yes', 'you', 'can']),

]);

mapper([1,2,3,4,5], (array) => {
        console.log(array);
            // result
                [16, 25, 'yes', 'you', 'can']
});

