async function getData() {
  const response = await fetch("https://dev.foleyprep.com/interview/");
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to fetch data");
  }
}

function gradeTest(data) {
  const result = [];
  for (const user of data.users) {
    const test = data.tests.find((t) => t.name === user.test);
    if (!test) {
      throw new Error(`Test not found: ${user.test}`);
    }
    const score = user.responses.reduce((acc, response, index) => {
      return response === test.answers[index] ? acc + 1 : acc;
    }, 0);
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
    const data = await getData();
    const result = gradeTest(data);
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

