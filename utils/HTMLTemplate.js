const HTMLTemplate = (text) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Offerz Planet</title>
          <style>
            .container {
              width: auto;
              height: auto;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #ec1c2c;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #ec1c2c;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>Offerz Planet</h1>
              </div>
              <div class="email-body">
                <p>${text}</p>
              </div>
              <div class="email-footer">
                <p>&copy; 2023 Offerzplanet. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  
module.exports = HTMLTemplate;