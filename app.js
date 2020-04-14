const puppeteer = require('puppeteer');

const timeInMinutes = 15;

/*const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});*/
let loginpassword="login hasło";

/*rl.question('Podaj login i haslo do librusa\n', (answer) => {
  
  loginpassword=answer;
  rl.close();
});*/

const createText1 = n => {
  if(n==0) return ' Program nie odczytał żadnych wiadomości';
  if(n==1) return ' Program odczytał jedną wiadomość:';
  let txt = ` Program odczytal ${n} wiadomości:`;
  return txt;
}

const logMessages = arr => {
  const arrWidth1 = 30;
  const arrWidth2 = 75;
  const arrWidth3 = 23;
  let line = " ";
  for(let i=0;i<arrWidth1+arrWidth2+arrWidth3+2;i++){
    line+='-';
  }
  console.log(line);
  let w=0;
  let str;
  let out;
  let s=0;
  arr.forEach(el => {
    s=0;
    out="";
    for(let i=0;s<2;i++){
      w=i+1;
      if(el.author.charAt(i)==' ') s++;
    }
    str=el.author.substr(0,w);
    out+='|'+str;
    for(let i=0;i<arrWidth1-w;i++) out+=" ";
    out+='|'+el.title;
    for(let i=0;i<arrWidth2-el.title.length;i++) out+=" ";
    out+='|  '+el.date+ "  |";
    console.log(out);
    console.log(line);
    return;
  });


}

setInterval(function(){


  (async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const url='https://adfslight.oswiatawradomiu.pl/LoginPage.aspx?ReturnUrl=%2f%3fwa%3dwsignin1.0%26wtrealm%3dhttps%253A%252F%252Fsynergia.librus.pl%252Floguj%252Fradom';
    await page.goto(url);

    await page.type('#Username', loginpassword.substr(0,9));
    await page.type('#Password', loginpassword.substr(10));
    await page.click('.submit-button');

    await page.waitForNavigation(); 
    await page.waitForNavigation();

  
    await page.goto('https://synergia.librus.pl/wiadomosci');
    
    //await page.screenshot({path: 'example.png'});
    e = await page.evaluate(() => {
      const messages = [];
      const unreadQuery = '.container-background > table > tbody > tr > td:nth-child(2n) > table:nth-child(2n) > tbody'+'> tr > td[style="font-weight: bold;"] ';
      
    // const clickList =   document.querySelectorAll(unreadQuery + '> a');
      const messList =   document.querySelectorAll(unreadQuery);
          
      messList.forEach((el, i) => {
        if(i%3==0) messages.push( {
          author: el.innerText,
          title: "",
          date: ""
        } );
        else if(i%3==1) messages[messages.length-1].title = el.innerText;
        else messages[messages.length-1].date = el.innerText;
      });
      
      
      return{
        messages
      }
    })
    for(let i=0;i<e.messages.length;i++){
      await page.click('.container-background > table > tbody > tr > td:nth-child(2n) > table:nth-child(2n) > tbody'+'> tr > td[style="font-weight: bold;"] '+' > a');
      //await page.screenshot({path: `test${i}.jpg`, fullPage: true})
      await page.goBack();
    }
    
    
    await browser.close();
    const date = new Date();
    const Time ={
      dzien: date.getDate(),
      miesiac: date.getMonth()+1,
      godzina: date.getHours(),
      minuta: date.getMinutes(),

    }
    if(Time.dzien<10) Time.dzien='0'+Time.dzien;
    if(Time.miesiac<10) Time.miesiac='0'+Time.miesiac;
    if(Time.godzina<10) Time.godzina='0'+Time.godzina;
    if(Time.minuta<10) Time.minuta='0'+Time.minuta;
    console.log(`Jest ${Time.dzien}/${Time.miesiac}, godzina  ${Time.godzina}:${Time.minuta}`);
    console.log(createText1(e.messages.length));
    
    logMessages(e.messages);

})();
},(1000*60*timeInMinutes));