function callGemini(prompt1, prompt2) {
  const payload = {
    "contents": [
      {
        "parts": [
          {
            "text": prompt1 + prompt2 
          },
        ]
      }
    ], 
    "generationConfig":  {
      "temperature": 0,
    },
  };

  const options = { 
    'method' : 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(geminiEndpoint, options);
  const data = JSON.parse(response);
  const content = data["candidates"][0]["content"]["parts"][0]["text"];
  console.log(content);

  return content;

}

function generateUniqueId() {
  var timestamp = new Date().getTime();
  var randomNum = Math.floor(Math.random() * 1000);
  return timestamp + "-" + randomNum;
}


function generateEmail(itemId, managerName, quantity) {
  var sheet = spreadsheet.getSheetByName('Restock');
  var sheet2 = spreadsheet.getSheetByName('Email');
  var row = sheet.getLastRow();
  var row2 = sheet2.getLastRow() + 1;
  const prompt2 = `item id:${itemId},manage name:${managerName},quantity:${quantity}`;
  const emailContent = callGemini(restock_request_prompt, prompt2);
  parts = emailContent.split("Body: \n\n");
  var subject = parts[0].replace('Subject: ', '').trim();
  var body = parts[1].trim();
  emailId = generateUniqueId();
  sheet2.getRange(row2, 1).setValue(emailId); 
  sheet.getRange(row, 6).setValue(emailId);
  sheet2.getRange(row2, 3).setValue("Team67");
  sheet2.getRange(row2, 4).setValue(subject);
  sheet2.getRange(row2, 5).setValue(body);
}

function getFilteredEmails() {
  var sheet = spreadsheet.getSheetByName('Email');
  var sheet2 = spreadsheet.getSheetByName('Request');
  var row = sheet.getLastRow() + 1;
  
  var threads = GmailApp.getInboxThreads(0, 100);
  threads = GmailApp.search('is:unread');
  var stockOutKeywords = ["stock out", "inventory out", "restock"];
  
  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    
    messages.forEach(function(message) {

      var emailId = message.getId(); 
      var date = message.getDate();
      var sender = message.getFrom();
      var subject = message.getSubject();
      var body = message.getPlainBody();
      var isStockOut = stockOutKeywords.some(keyword => subject.toLowerCase().includes(keyword) || body.toLowerCase().includes(keyword));
      
      if (isStockOut) {
        sheet.getRange(row, 1).setValue(emailId); 
        sheet.getRange(row, 2).setValue(date);
        sheet.getRange(row, 3).setValue(sender);
        sheet.getRange(row, 4).setValue(subject);
        sheet.getRange(row, 5).setValue(body);
        var x = callGemini(order_request_prompt,body);
        var data = x.split(",");
        var requestId = generateUniqueId();
        sheet2.getRange(row, 1).setValue(requestId); 
        sheet2.getRange(row, 2).setValue(emailId); 
        sheet2.getRange(row, 3).setValue(data[0]);
        sheet2.getRange(row, 4).setValue(data[1]);
        sheet2.getRange(row, 5).setValue(date);
        sheet2.getRange(row, 6).setValue(data[2]);
        sheet2.getRange(row, 7).setValue("PENDING")
        message.markRead();
      }

    });
  });
}

function updateRestockStatus(emailId){
  var sheet = spreadsheet.getSheetByName('Restock');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) { 
    if (data[i][5] == emailId) { 
      sheet.getRange(i + 1, 5).setValue(" EMAIL SENT");
    }
  }
}



