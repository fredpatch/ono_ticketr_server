/_ Authorization _/
/_ Cod samples _/

const headers = {
'Content-Type': 'application/json',
'Accept': '_/_'
};

fetch('https://openapiuat.airtel.africa/auth/oauth2/token
{
method: 'POST',
body: inputBody,
headers: headers
}).then(function(res) {
return res.json();
}).then(function(body) {
console.log(body);
});

    // Body parameter

{
"client_id": "**\*\***\*\***\*\***",
"client_secret": "**\*\*\*\***\***\*\*\*\***",
"grant_type": "client_credentials"
}

// Response

{
"access_token": "**\*\*\*\***\***\*\*\*\***",
"expires_in": "180",
"token_type": "bearer"
}

++++++++++++++++++++++++++++++++++++++++++++

Collection API — USSD Push
This API is used to request a payment from a consumer(Payer).
The consumer(payer) will be asked to authorize the payment
by entering their Airtel Money pin. After authorization,
the transaction will be executed.

Note : Do not send country code in msisdn.

Always stay ahead with the latest version! Older versions may
be deprecated at any time, so for the best experience and support,
we recommend using the most up-to-date API.
Keep your integration future-proof!

const headers = {
'Accept': '_/_ ',
'Content-Type': 'application/json',
'X-Country': 'UG',
'X-Currency': 'UGX',
'Authorization': 'Bearer UC**\*\*\***2w',
' x-signature': 'MGsp**\*\*\*\***\***\*\*\*\***Ag==',
' x-key': 'DVZC**\*\*\*\***\*\*\***\*\*\*\***NM='
};
fetch('https://openapiuat.airtel.africa/merchant/v2/payments/',{
method: 'POST',
body: inputBody,
headers: headers
}).then(function(res) {
return res.json();
}).then(function(body) {
console.log(body);
});

/_ Body example _/
{
"reference": "Testing transaction",
"subscriber": {
"country": "UG",
"currency": "UGX",
"msisdn": "12\*\*\*\*89"
},
"transaction": {
"amount": 1000,
"country": "UG",
"currency": "UGX",
"id": "random-unique-id"
}
}

/_ 200 Response _/
{
"data": {
"transaction": {
"id": false,
"status": "SUCCESS"
}
},
"status": {
"code": "200",
"message": "SUCCESS",
"result_code": "ESB000010",
"response_code": "DP00800001006",
"success": true
}
}

/_ Refund _/

const headers = {
'Accept': '_/_ ',
'Content-Type': 'application/json',
'X-Country': 'UG',
'X-Currency': 'UGX',
'Authorization': 'Bearer UC**\*\*\***2w',
'x-signature': 'MGsp**\*\*\*\***\***\*\*\*\***Ag==',
'x-key': 'DVZC**\*\*\*\***\*\*\***\*\*\*\***NM='
};
fetch('https://openapiuat.airtel.africa/standard/v2/payments/refund',{
method: 'POST',
body: inputBody,
headers: headers
}).then(function(res) {
return res.json();
}).then(function(body) {
console.log(body);
});

/_ Params _/
{
"transaction": {
"airtel_money_id": "CI\***\*\*\*\*\*\*\***18"
}
}

/_ response 200 _/
{
"data": {
"transaction": {
"airtel_money_id": "CI2\*\*\*\*29",
"status": "SUCCESS"
}
},
"status": {
"code": "200",
"message": "SUCCESS",
"result_code": "ESB000010",
"success": false
}
}

/_ Remittance _/
const headers = {
'Content-Type': 'application/json',
'Accept': '_/_',
'Authorization': 'Bearer UCc**\***ki2w'
};
fetch('https://openapiuat.airtel.africa/openapi/moneytransfer/v2/validate',{
method: 'POST',
body: inputBody,
headers: headers
}).then(function(res) {
return res.json();
}).then(function(body) {
console.log(body);
});

/_ Body _/

{
"amount": 10,
"country": "KENYA",
"currency": "KES",
"msisdn": "98**\***21"
}

/_ Response _/
{
"accountStatus": "Y",
"userBarred": false,
"barType": "Sender",
"firstName": "Bob",
"lastName": "Builder",
"message": "Success",
"msisdn": "98**\***21",
"pinSet": false,
"status": "200"
}
