var API_ENDPOINT="";
var PROJECT_ID="gen-lang-client-0820513855";
var SERVICE_ACCOUNT_EMAIL= 'team67@gen-lang-client-0820513855.iam.gserviceaccount.com';
var SERVICE_ACCOUNT_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmq7nD3X8BwUIj\n/e/bG+7s6c7wEOC2zz3ud8dD1zi5MORtfSvdF4ef0wk0PF8v1FwBVtvoO7wClPfH\nyNYaq9L1wMDj+MOzihW+reeVsE9pxP2VTSYpi13OVU/51c7L5n+S6M8MYshjFYWK\nQp9ZYoVWZYnhfbHH1rgzAUE18dE385VKOH/LKui0EzhlScTNKQpPrOGV+TkFxf1z\nntQg6ZLcBbx4/nj6ZTtKmYLOleScIfb62a14nvJ403KddjmfMQfIg8N2uBHGPJRH\ne1HbQQAEeLYwxEYJx7pOi6e6aamcZD+2T/TG4uz9u59k0MdHAI8Rxl5xCIsK0YqA\ndSqF8McPAgMBAAECggEALCABpcuxsL6/6nRzuF/8UMeTrDXjsDJMtKIMZLcJgunh\nR+VgI//zPYprAOPM1YZUt1wOCz0pSMu0j7VpjZUY3EwkJRa6hQFVQW6cBaKwW5G2\nCv1qUYxekN5ANqX2wj+rXbL6Ac7zO1w6xwBdXJY7M8TdDJAw7XW4vXQjFguHttZ9\nX9w/nTyHxMR4sTgJ/setRQ7uePEl8EbWY4DAgl2EqwtL58NGRvyUcS1XpJk+jSmT\nzLzdvJqRjtdGIc5MepyGQwyW+iG+bamRkLsAUvPgToCuvyasEN3yiIXTuVrpWT9P\nfcXDHaTHXUixbLI9s3SJYgQmpWk8Vhuae5yPdSexdQKBgQDqHKyUmDmZiEilLEpW\nn3zvjner0GiOiTHE26XLmSn+wILnInBxv6BVxOUgWswoz21n7+GAphKadHzQ5r1G\n2IggDM6DrbevZ65XQv2Ql1tXGnuZgQS9/N1Vybvh+L8HKNTdBvo+nkBJsWPJQ025\nNziHddAknzQ71dgEV7LYhx1hwwKBgQC2QONXGYh0m0QrIiWXDSaLg29GwZRfAq/g\nTAdYWdxwJkhPVfZC+17iWodGZbLzQ3xHH8sKhLaN7J2OuxN6fYVmbDR2jRCitVAU\nxvxRunZW+8DhSXDbS6FBZzsMt1YYUPr1OBs7uAtb0YwFPJWPCUdIh10m1FyK4mEV\n29Am16SExQKBgD28Jf5hTf8goxd7YHcLQ6TgSspyAMBliUxCJ6xSzXIyTdKpkEFO\nqPc1Hr6zctboLA+WgD6ujIVSZn+n+Q2vl+XruqGas697hcvZDIiOgTWs9B78mMWI\n4sz2j6b9M1Kt/8PxTRgqHwXP02KFbv+CglOmS6b8nIeS0o4CmlTi/GqFAoGBAJzs\nwBLl9D1a11ZAX5dxBkhIEk8dLNCl8qOxMv3a2dhizg4pmRHReMBzbFisBmo5KE/h\nSyUyYjFPk9YqtDnazDsFXiLZkYJXla1eLDF+2JhKyqfwYVEhDKbQ6OIpFeN4Dq2H\n8sL31CfqBKMZqDjxp0QG8akWXtxi0W9Nxis7r/d1AoGAcB53M0QEcDkWLd5qy38T\nrjRwTyEPT0xB+A5SFdmA6B+vW1uYNwbe3YBAyW1kkKOQZbxUkTw9px4WKEoQueQt\n9ONUGpb1Lkkl9c9G5mceuqC56XhNMHtgpXG9SgD2lPoUZOhtz5+3/MKryI+9qLQa\nBSiKjIPitZ4GU69/WpTMTnk=\n-----END PRIVATE KEY-----\n';

//Enter AppSheet app info below
var app_id = '05dd2bd4-91b6-41e5-8f0d-1580265c0261';
var access_key = 'V2-pebq4-Z7Wt7-MLIWG-OXzcv-H6EZ2-4uA3q-49dLC-JjUeV';
var table_name = 'Email';
var appsheet_url = "https://api.appsheet.com/api/v2/apps/"
          + app_id
          + "/tables/" + table_name
          + "/Action?applicationAccessKey=" + access_key;

const properties = PropertiesService.getScriptProperties().getProperties();
const geminiApiKey = properties['GOOGLE_API_KEY'];
const geminiEndpoint =`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
var spreadsheet = SpreadsheetApp.openById("1dz-4SOkMnJIiGlpoM5XaNhBZexNYFy7dc6f5_7egMR4");

const order_request_prompt = 
"Take following string format as an input, generate elements content based on prompts and prepare and return string structure by combining all elements such as: <value>,<value>,<value>. This is an inventory management system. You are creating an order request. Fill in the following 3 elements based on this email with concise minimal words. Replace <value> in plain text." +
"" +
"<Item ID>,<Quantity>,<Department>"
"" +
"Email content: ";

const restock_request_prompt =
  "Generate an email subject and body to request restock from the vendor manager. Use the following format: " +
  "Subject: <Subject> " +
  "Body: <Body>. " +
  "Fill in the <Subject> and <Body> based on the provided item ID, manager name, and quantity. My name is Chan Hong Rui, inventory manager from team67 company" +
  "\n" 

