async function getTestData() {
  const response = await fetch("https://dev.foleyprep.com/interview/");
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed");
  }
}

function gradedTests(data) {
    const result = [];
    for (let i = 0; i < data.users.length; i++) {
      const user = data.users[i];
      let test = null;
      for (let j = 0; j < data.tests.length; j++) {
        if (data.tests[j].name === user.test) {
          test = data.tests[j];
          break;
        }
      }
      if (!test) {
        throw new Error(`Test not found: ${user.test}`);
      }
      let score = 0;
      for (let k = 0; k < user.responses.length; k++) {
        if (user.responses[k] === test.answers[k]) {
          score++;
        }
      }
      result.push({
        name: user.name,
        test: user.test,
        score: (score / test.answers.length) * 100,
      });
    }
    return result;
  }
  

const scoreTestButton = document.querySelector(".scoreTest");
scoreTestButton.addEventListener("click", async () => {
  try {
    const data = await getTestData();
    const result = gradedTests(data);
    console.log(result);
    const resultsDiv = document.querySelector(".results");
    resultsDiv.innerHTML = "";
    for (const item of result) {
      resultsDiv.innerHTML += `
        <div>
          Name: ${item.name}
          Test: ${item.test}
          Score: ${item.score}%
        </div>
      `;
    }
  } catch (error) {
    console.error(error);
  }
});

