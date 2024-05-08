
Qualtrics.SurveyEngine.addOnload(function () {
    // console.log("logging new save");
    var questionContainer = this.getQuestionContainer();
    
    // Setting Anchor tags to redirect 
    var anchorTags = questionContainer.querySelectorAll('a');
    anchorTags.forEach(function(anchorTag) {
        anchorTag.setAttribute('target', '_blank');
    });
    
    // Reset the button on click
    var applyButtons = questionContainer.querySelectorAll("#deeplink");
    applyButtons.forEach(function(button) {
        const buttonText = button.textContent.trim();
        console.log(buttonText);
        fetch("https://newdev.sjsu.edu/education/easybutton/test.csv")
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to connect to test.csv ensure that test.csv is located at https://newdev.sjsu.edu/education/easybutton/test.csv");
            }
            return response.text();
        }).then(data => {
           // console.log("CSV Data:", data); // Debug: Log the CSV data
            return data.split(/[,\n]/);
        })
        .then(data => {
            for (var i = 0; i < data.length; i = i + 3) {
                console.log(data[i].trim());
                if (data[i].trim() === buttonText) { // Compare button text with data[i]
                    var dateString = data[i + 2];
                    var parts = dateString.split('/');
                    var formattedDate = new Date(parts[2], parts[0] - 1, parts[1]).getTime();
                    var currentDate = Date.now() ;
                    if (formattedDate > currentDate) {
						console.log("DateString:" ,dateString);
						console.log("ButtonText:", buttonText);
						const newContent = buttonText + ": Opens " + dateString;
						console.log(newContent);
                        button.textContent = newContent;
                    } else {
						console.log(data[i+1]);
                        button.onclick = () =>  {
                            window.open(data[i + 1], '_blank');
                        }
                    }   
                    console.log(currentDate);
                    console.log(formattedDate);
                    return;
                }
            }
            throw new Error("Button text not mapped to endpoint in test.csv");
        })
        .catch(error =>  {
			const message = "EasyButton Error:" + error.message
			console.log(message);
            button.onclick = () =>  {
                            window.open("https://www.calstate.edu/apply", '_blank');
			}
        });
    });
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	this.hideNextButton();
});
