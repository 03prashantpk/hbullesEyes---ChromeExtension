// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'runScriptAns') {
      // Replace this with your existing script content
      var answerKey = request.testAnswerKey; // Use the correct variable name
      var testName = request.testName;
      var currentQuestionIndex = 1;
     
      confirm('Are you sure you want to start the script for ' + testName + '?\n' + answerKey.length + ' questions will be answered.')
  
      function selectAnswerAndNext(questionIndex) {
        var answer = answerKey[questionIndex - 1];
        var radioButtons = document.querySelectorAll('input[name="radio_' + questionIndex + '"]');
        
        if (radioButtons.length > 0) {
          var index = answer.charCodeAt(0) - 'A'.charCodeAt(0);
          if (index >= 0 && index < radioButtons.length) {
            radioButtons[index].click();
  
            // Set the hidden input values
            document.getElementById('selected_answer_' + questionIndex).value = answer;
            document.getElementById('marked_' + questionIndex).value = '1';
          }
  
          // Click the "Save & Next" button
          document.querySelector('.savenext').click();
        }
      }
  
      // Function to handle multiple questions
      function processQuestions() {
        selectAnswerAndNext(currentQuestionIndex);
  
        // Move to the next question
        currentQuestionIndex++;
  
        // Stop the process if we reached the end of the answer key
        if (currentQuestionIndex > answerKey.length) {
          clearInterval(interval);
        }
      }
  
      // Set an interval to repeatedly select answers and click "Save & Next"
      var interval = setInterval(processQuestions, 1000);
  
      // Send a response back to the popup
      sendResponse({ status: 'Script started' });
    }
});
