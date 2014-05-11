/**
 * @file: Frame used for demonstrating waxon.
 */

// Create a new object, inheriting properties from 'waxonQuestion'.
var demoFrame = new waxonFrame('demoFrame');

demoFrame.buildQuestionStack = function() {
  var questionWeights = {
    simpleAddition : 5,
    fractionsMixed : 10,
    multiplyingBinomials : 20,
  }
  var sum = 0, select;
  for (var i in questionWeights) {
    sum = sum + questionWeights[i];
    questionWeights[i] = sum;
  }

  select = waxonUtils.randomInt(1, sum);
  for (var i in questionWeights) {
    if (questionWeights[i] >= select) {
      return [i];
    }
  }
};

demoFrame.drawAreas = function() {
  var app = UiApp.getActiveApplication();
  var attributes = {
    border : 'thin black solid',
    minHeight : '100px',
    maxHeight : '200px',
    margin : '3px',
    padding : '3px',
  }

  waxon.addArea('questionarea', attributes);
  waxon.addArea('answerarea', attributes);
  waxon.addArea('feedbackarea', attributes);
  waxon.addArea('resultarea', attributes);
//  attributes.visible = 'false';
//  waxon.addArea('debug', attributes);

  delete(attributes.border);
  delete(attributes.background);
  waxon.addArea('infobox', attributes);
  waxon.addToArea('infobox', 'Det här är en tidig version av projektet "waxon", med mål att göra det lätt att sätta samman uppgifter för mängdträning.');
  waxon.addToArea('infobox', 'Tanken är att man ska kunna lägga till nya typer av frågor som egna plugins, och att man ska kunna använda olika lägen för att träna på uppgifterna.');
  waxon.addToArea('infobox', 'I denna tidiga proof-of-concept finns bara tre typer av frågor (enkel addition, bråkräkning, samt utveckling av parentesuttryck).');
  waxon.addToArea('infobox', 'Det läge som används för att träna på frågor på denna sida ger oändligt många frågor, med relativ sannolikhet 5/10/20 för de olika frågetyperna ovan. Om waxon-idén lyfter fungerar kommer det att dyka upp fler typer av frågor, och fler sätt att använda dem (exempelvis diagnoser med färdiga set av frågor, plus sammanställning av resultat för lärare).');
  waxon.addToArea('infobox', app.createLabel('Projektet är open source och går att hitta på https://github.com/Itangalo/waxon'));
  return app;
}

demoFrame.processResponse = function(responseCode, responseMessage) {
  var app = UiApp.getActiveApplication();

  waxon.clearArea('feedbackarea');
  waxon.clearArea('resultarea');
  var question = waxon.getQuestionInfo();
  var result = waxon.getUserData('result');

  // If there is no result data yet, build empty strings.
  if (result == null) {
    for (var id in waxon.questionIds) {
      result[waxon.questionIds[id]] = result[waxon.questionIds[id]] || '';
    }
  }

  // Process responses. Only give new question on correct answer.
  if (responseCode < -1) {
    waxon.addToArea('feedbackarea', 'Ditt svar går inte att tolka eller verkar jättefel.');
    result[question.id] += '-';
  }
  else if (responseCode == -1) {
    waxon.addToArea('feedbackarea', 'Fel. Sorry.');
    result[question.id] += '-';
  }
  else if (responseCode > 0) {
    waxon.removeQuestion();
    waxon.addToArea('feedbackarea', 'Rätt! Bygger nästa fråga...');
    result[question.id] += '+';
  }
  else {
    waxon.addToArea('feedbackarea', 'Ditt svar är nästan rätt. Kolla och försök igen.');
  }
  if (responseMessage != '') {
    waxon.addToArea('feedbackarea', app.createLabel('Mer information: ' + responseMessage));
  }

  // Trim the result string if it is longer than 10 characters.
  if (result[question.id].length > 10) {
    result[question.id] = result[question.id].substring(1);
  };
  waxon.setUserData(result, 'result');
  // Display the results for the different question types.
  for (var id in waxon.questionIds) {
    waxon.addToArea('resultarea', waxon.questionIds[id] + ': ' + result[waxon.questionIds[id]]);
  }

  return app;
}