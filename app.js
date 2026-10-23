/* No network, storage, cookies, telemetry or free-text inputs. */
(() => {
  'use strict';
  const {accessQuestionOptions,assessNumberAccess,completeAccessAnswers}=globalThis.NumberAccessDecision;
  const {numberAccessCopy}=globalThis.NumberAccessTranslations;
  const languages=['en','tr','pt','de','ru','id','bn','es'];
  const byId=id=>document.getElementById(id);
  const form=byId('questions');
  const result=byId('result');
  let language='en';
  let answers={};

  function textElement(tag,text,className){
    const element=document.createElement(tag);
    element.textContent=text;
    if(className)element.className=className;
    return element;
  }
  function clearResult(){result.hidden=true;result.replaceChildren();}
  function renderLanguage(){
    answers={};
    clearResult();
    const copy=numberAccessCopy(language);
    document.documentElement.lang=language;
    document.title=copy.title;
    byId('language').value=language;
    for(const [id,key] of Object.entries({'title':'title','lead':'lead','kicker':'kicker','privacy':'privacy','form-title':'formTitle','how-title':'howTitle','how-text':'howText','limits-title':'limitsTitle','limits-text':'limitsText','submit':'submit','reset':'reset','guide':'guideLabel','services':'servicesLabel'}))byId(id).textContent=copy[key];
    byId('guide').href=`https://receivesmsgo.co/${language}/guide`;
    byId('services').href=`https://receivesmsgo.co/${language}/services`;
    form.replaceChildren();
    Object.entries(accessQuestionOptions).forEach(([question,values],index)=>{
      const fieldset=document.createElement('fieldset');
      const legend=textElement('legend',`${index+1}. ${copy.questions[question].title}`);
      fieldset.append(legend);
      const options=textElement('div','','options');
      values.forEach(value=>{
        const label=document.createElement('label');
        const input=document.createElement('input');
        input.type='radio';input.name=question;input.value=value;input.required=true;
        input.addEventListener('change',()=>{
          answers[question]=value;
          fieldset.querySelectorAll('label').forEach(item=>item.classList.remove('selected'));
          label.classList.add('selected');
          clearResult();
        });
        label.append(input,textElement('span',copy.questions[question].options[value]));
        options.append(label);
      });
      fieldset.append(options);form.append(fieldset);
    });
    byId('checker').hidden=false;
  }
  form.addEventListener('submit',event=>event.preventDefault());
  byId('submit').addEventListener('click',()=>{
    if(!form.reportValidity() || !completeAccessAnswers(answers))return;
    const copy=numberAccessCopy(language);
    const decision=assessNumberAccess(answers);
    const guidance=copy.results[decision.outcome];
    const title=textElement('h2',guidance.title);title.id='result-title';
    const contents=[textElement('p',copy.resultLabel,'kicker'),title,textElement('p',guidance.body)];
    if(decision.reasons.length){
      const list=document.createElement('ul');
      decision.reasons.forEach(reason=>list.append(textElement('li',copy.reasons[reason])));
      contents.push(textElement('h3',copy.reasonsTitle),list);
    }
    contents.push(textElement('h3',copy.nextTitle),textElement('p',guidance.next),textElement('p',copy.limitation,'limitation'));
    result.replaceChildren(...contents);
    result.className=`result result-${decision.outcome}`;
    result.hidden=false;result.focus();
  });
  byId('reset').addEventListener('click',()=>{renderLanguage();form.querySelector('input').focus();});
  byId('language').addEventListener('change',event=>{
    if(languages.includes(event.target.value)){language=event.target.value;renderLanguage();}
  });
  renderLanguage();
})();
