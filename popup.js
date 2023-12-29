document.getElementById('runScript').addEventListener('click', function () {
    fetch('https://bullseyesapi.onrender.com/api/tests')
        // Haa bhai kr le use api
        .then(response => response.json())
        .then(tests => {
            tests.sort((a, b) => new Date(b.dateUpdated) - new Date(a.dateUpdated));

            const testListContainer = document.getElementById('testList');
            testListContainer.innerHTML = '';

            tests.forEach(test => {
                const testButton = document.createElement('button');
                testButton.className = 'testButton';
                testButton.textContent = test.testName;

                const todayDate = new Date().toLocaleDateString();
                const testDate = new Date(test.dateUpdated).toLocaleDateString();
                if (testDate === todayDate) {
                    testButton.classList.add('today');
                }

                testButton.addEventListener('click', function () {
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'runScriptAns', testAnswerKey: test.answerKey, testName: test.testName }, function (response) {
                            if (response && response.status) {
                                document.getElementById('response').textContent = response.status;
                            } else {
                                console.error('Invalid response:', response);
                                document.getElementById('response').textContent = 'Error: Invalid response';
                            }
                        });
                    });
                });
                testListContainer.appendChild(testButton);
            });
        })
        .catch(error => console.error('Error fetching tests:', error));

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'runScript' },
            function (response) {
                console.log('Script Executed');
                if (response && response.status) {
                    document.getElementById('response').textContent = response.status;
                } else {
                    console.error('Invalid response:', response);
                    document.getElementById('response').textContent = 'Error: Invalid response';
                }
            }
        );
    });
});
