module.exports= {
    startGame: startGame,
    submit: submit
};

function startGame() {
    console.log('mainAPI');

    var a= Math.floor((Math.random() * 9));
    var b= Math.floor((Math.random() * 9));
    var c= Math.floor((Math.random() * 9));
    var d= Math.floor((Math.random() * 9));

    // var a= 5, b=6, c=1, d=1;

    console.log('a b c d', a, b, c, d);

    for(var i=0; i<totalOperations.length; ++i){
        for(var j=0; j<totalOperations.length; ++j){
            var obj= {
                numbers: [a, b, c, d],
                first: totalOperations[i],
                second: totalOperations[j]
            };
            var solObj= {};
            solObj= one(obj);
            if(solObj.status) return solObj.data;
            else{
                solObj= two(obj);
                if(solObj.status) return solObj.data;
                else{
                    solObj= three(obj);
                    if(solObj.status) return solObj.data;
                    else solObj= {};
                }
            }
        }
    }
    console.log('not found!');
    startGame();
}

function one(obj) {
    var newObj= {
        numbers: obj.numbers,
        operations: ['=', obj.first, obj.second]
    };
    if(submit(newObj).success == true) {
        console.log('one', newObj);
        return {
            status: true,
            data: newObj
        };
    }
    else return {
        status: false
    };
}

function two(obj) {
    var newObj= {
        numbers: obj.numbers,
        operations: [obj.first, '=', obj.second]
    };
    if(submit(newObj).success == true) {
        console.log('two', newObj);
        return {
            status: true,
            data: newObj
        };
    }
    else return {
        status: false
    };
}

function three(obj) {
    var newObj= {
        numbers: obj.numbers,
        operations: [obj.first, obj.second, '=']
    };
    if(submit(newObj).success == true) {
        console.log('two', newObj);
        return {
            status: true,
            data: newObj
        };
    }
    else return {
        status: false
    };
}

var totalOperations= ['+', '-', '*', '/'];
var operatorFunctions = {
    '+': function(a, b) { return a + b },
    '-': function(a, b) { return a - b },
    '*': function(a, b) { return a * b },
    '/': function(a, b) { return a / b }
};

var priority= {
    '/': 4,
    '*': 3,
    '-': 2,
    '+': 1
};


function submit(postObj){
    // console.log('submit function');

    var numbers= postObj.numbers;
    var operations= postObj.operations;

    var infixArray= [];
    for(var i=0; i<operations.length; ++i){
        infixArray.push(numbers[i]);
        infixArray.push(operations[i]);
    }
    infixArray.push(numbers[numbers.length-1]);
    // console.log(infixArray);

    var infixArray1= [], infixArray2= [];

    var temp=0, cntr= 0;
    for(temp=0; infixArray[temp]!= '='; ++temp){
        infixArray1[cntr++]= infixArray[temp];
    }

    cntr= 0; temp++;
    for(; temp< infixArray.length; ++temp){
        infixArray2[cntr++]= infixArray[temp];
    }

    var postfixArr1= createPostfix(infixArray1);
    var postfixArr2= createPostfix(infixArray2);

    var num1= validatePostfix(postfixArr1);
    var num2= validatePostfix(postfixArr2);

    if(num1 == num2) {
        console.log('num1 num2', num1, num2);
        return {success: true};
    }
    else return {success: false};
}

function createPostfix(infixArr) {
    var stack= [];
    var postfixArr= [];

    for(var i=0; i<infixArr.length; ++i){
        if(totalOperations.indexOf(infixArr[i]) == -1){
            //number
            postfixArr.push(infixArr[i]);
        }else if(stack.length==0){
            stack.push(infixArr[i]);
        }
        else{
            if(priority[stack[stack.length-1]] > priority[infixArr[i]]){
                var x= stack.pop();
                postfixArr.push(x);
            }
            stack.push(infixArr[i]);
        }
    }
    while(stack.length!=0) postfixArr.push(stack.pop());
    return postfixArr;
}

function validatePostfix(postfixArr) {
    var stack= [];
    for(var i=0; i<postfixArr.length; ++i){
        if(totalOperations.indexOf(postfixArr[i]) == -1){
            stack.push(postfixArr[i]);
        }
        else {
            var second= stack.pop(), first= stack.pop();
            stack.push(operatorFunctions[postfixArr[i]](first, second));
        }
    }

    var ans= stack.pop();
    return ans;
}