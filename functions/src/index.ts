import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as r from 'request';

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
export const helloWorld = functions.https.onRequest((request, response) => {


    response.send("Hello from Firebase!");
});



admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions



export const webhook2 = functions.https.onRequest((request, response) => {

    //     let citiesRef = db.collection('matriculation')

    //     citiesRef.add({ 2016: 10, college: "Harvard University" });
    //     citiesRef.add({ 2016: 9, college: "Boston College" });
    //     citiesRef.add({ 2016: 8, college: "Brown University" });
    //     citiesRef.add({ 2016: 7, college: "Colby College" });
    //     citiesRef.add({ 2016: 5, college: "Dartmouth College" });
    //     citiesRef.add({ 2016: 5, college: "Middlebury College" });
    //     citiesRef.add({ 2016: 5, college: "Trinity College" });
    //     citiesRef.add({ 2016: 5, college: "University of Chicago" });
    //     citiesRef.add({ 2016: 4, college: "Boston University" });
    //     citiesRef.add({ 2016: 4, college: "New York University" });
    //     citiesRef.add({ 2016: 4, college: "University of Michigan" });
    //     citiesRef.add({ 2016: 3, college: "Colorado College" });
    //     citiesRef.add({ 2016: 3, college: "Hamilton College - NY" });
    //     citiesRef.add({ 2016: 3, college: "University of Virginia" });
    //     citiesRef.add({ 2016: 3, college: "Wesleyan University" });
    //     citiesRef.add({ 2016: 3, college: "Williams College" });
    //     citiesRef.add({ 2016: 2, college: "Amherst College" });
    //     citiesRef.add({ 2016: 2, college: "Bentley University" });
    //     citiesRef.add({ 2016: 2, college: "Bowdoin College" });
    //     citiesRef.add({ 2016: 2, college: "Columbia University" });
    //     citiesRef.add({ 2016: 2, college: "Cornell University" });
    //     citiesRef.add({ 2016: 2, college: "Georgetown University" });
    //     citiesRef.add({ 2016: 2, college: "Hobart and William Smith Colleges" });
    //     citiesRef.add({ 2016: 2, college: "University of Pennsylvania" });
    //     citiesRef.add({ 2016: 2, college: "Wake Forest University" });
    //     citiesRef.add({ 2016: 2, college: "Washington University in St. Louis" });
    //     citiesRef.add({ 2016: 2, college: "Yale University" });
    //     citiesRef.add({ 2016: 1, college: "Babson College" });
    //     citiesRef.add({ 2016: 1, college: "Bates College" });
    //     citiesRef.add({ 2016: 1, college: "Claremont McKenna College" });
    //     citiesRef.add({ 2016: 1, college: "Colgate University" });
    //     citiesRef.add({ 2016: 1, college: "College of the Holy Cross" });
    //     citiesRef.add({ 2016: 1, college: "Davidson College" });
    //     citiesRef.add({ 2016: 1, college: "Elon University" });
    //     citiesRef.add({ 2016: 1, college: "Lafayette College" });
    //     citiesRef.add({ 2016: 1, college: "Princeton University" });
    //     citiesRef.add({ 2016: 1, college: "Providence College" });
    //     citiesRef.add({ 2016: 1, college: "Purdue University" });
    //     citiesRef.add({ 2016: 1, college: "Rice University" });
    //     citiesRef.add({ 2016: 1, college: "Siena College" });
    //     citiesRef.add({ 2016: 1, college: "Skidmore College" });
    //     citiesRef.add({ 2016: 1, college: "Stanford University" });
    //     citiesRef.add({ 2016: 1, college: "Tufts University" });
    //     citiesRef.add({ 2016: 1, college: "University of Richmond" });
    //     citiesRef.add({ 2016: 1, college: "University of Texas - Austin" });
    //     citiesRef.add({ 2016: 1, college: "Vanderbilt University" });
    //     citiesRef.add({ 2016: 1, college: "Wellesley College" });
})

exports.webhook = functions.https.onRequest((request, response) => {
    console.log(request.body);

    switch (request.body.result.action) {
        case "Enrollment":

            const name = request.body.result.parameters["given-name"];
            const age = request.body.result.parameters.age;
            const Class = request.body.result.parameters.Class;

            // Add a new document with a generated id.
            db.collection('enrollment').add({
                name: name,
                age: age,
                Class: Class
            }).then(ref => {
                console.log('Added document with ID: ', ref.id);
                response.send({
                    speech: `${name}, you are enrolled in ${Class}`
                })
            }).catch(e => {
                console.log("something bad happened");
            })

            break;

        case "getEnrollment":

            console.log("getting enrollment is invoked");

            let subject = request.body.result.parameters.subject;

            const enrollmentRef = db.collection('enrollment');
            enrollmentRef.where('Class', '==', subject).get()
                .then(snapshot => {

                    const studentsList = [];

                    snapshot.forEach(doc => {
                        console.log(doc.id, '=>', doc.data());
                        // S9rSEcZ4qiwgclpNqtk2 => {...}
                        studentsList.push(doc.data())
                    });

                    let message = "";

                    for (let i = 0; i < studentsList.length; i++) {
                        message += "Student" + (i + 1) + "'s name is" + studentsList[i].name + ",";
                    }

                    response.send({
                        speech: "I have found" + studentsList.length + "college." + message
                    })


                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
            break;

        case "getMatriculation":
            console.log("getMatriculation is invoked");

            subject = request.body.result.parameters.subject;
            const college = request.body.result.parameters.college;


            enrollmentRef.where('Class', '==', subject).get()
                .then(snapshot => {

                    const studentsList = [];

                    snapshot.forEach(doc => {
                        console.log(doc.id, '=>', doc.data());
                        // S9rSEcZ4qiwgclpNqtk2 => {...}
                        studentsList.push(doc.data())
                    });

                    let message = "";

                    for (let i = 0; i < studentsList.length; i++) {
                        message += "Student" + (i + 1) + "'s name is" + studentsList[i].name + ",";
                    }
                    response.send({
                        speech: "I have found" + studentsList.length + "college." + message
                    })
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        case "getPopulation":

            console.log('getPopulation is invoked');
            const college1 = request.body.result.parameters.school1;
            const results = [];

            db.collection('matriculation').where('college', '==', college1).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.data());
                        results.push(doc.data())
                    });

                    console.log("the answer is: ", results[0]);

                    let speech = '';

                    if (results[0].students === 1) {
                        speech = `${results[0].students} student went to ${results[0].college} last year. http://www.nobles.edu/upper-school/FiveYearMatriculation.cfm`
                    }
                    else {
                        speech = `${results[0].students} students went to ${results[0].college} last year. http://www.nobles.edu/upper-school/FiveYearMatriculation.cfm`
                    }


                    response.send({
                        speech: speech
                    })

                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });




            break;
        default:
            response.send({
                speech: "ok something went wrong"
            })
    }
})

export const makeEntity = functions.https.onRequest((req, res) => {


    const entity = {
        "entries": [],
        "name": "school1"
    }

    db.collection('matriculation').get().then(snapshot => {

        snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data());

            entity.entries.push({
                "value": doc.data().college
            })
        });

        console.log("entity data: ", entity);

        r.post({
            url: "https://api.dialogflow.com/v1/entities?v=20150910",
            headers: {
                "Authorization": "Bearer 8efec1c508e4499f8cdf078c233223b2",
                "Content-Type": "application/json"
            },
            json: entity
        }, function (error, response, body) {

            //checking if response was success
            if (!error && (response.statusCode === 200 || response.statusCode === 201)) {

                const responseBody = response.body;
                console.log("http post success, responseBody: ", responseBody);

                res.send("ok")

            } else {
                console.log("http post error, url: ", error, response.statusCode);
                res.send("error")
            }

        })


    }).catch(e => {
        console.log("something bad happened in database query")
        res.send("error :-(")
    })
})






// let abc = function (input) {

// }

// let abcd = e => {

// }




