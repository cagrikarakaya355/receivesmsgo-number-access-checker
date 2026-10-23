# Number access checker

A small, free decision aid for choosing **how long and through which channel you need access to a phone number**. It works independently in a browser, without an account, API key, build step or external dependency.

[Hosted version at ReceiveSMSGo](https://receivesmsgo.co/en/number-access-checker)

## Run it

Download this repository and open `index.html` in your browser. All scripts, translations and styles are local files. You can also serve the directory with any static web server. Node.js is needed only to run the optional tests:

```sh
node --test test.mjs
```

English, Turkish, Portuguese, German, Russian, Indonesian, Bengali and Spanish are included. Changing the language or reloading the page clears your choices.

## What it does

The five questions cover authorization, access duration, future access to the same number, SMS versus voice, and important accounts or recovery. The result explains which access properties you need and what to check next.

The most restrictive condition determines the main guidance. Every relevant reason remains visible:

1. Unclear ownership or testing permission: clarify permission first.
2. Voice needed: choose a service that explicitly supports voice and your needed duration.
3. Repeated or ongoing access, uncertain future reuse, or important account recovery: choose a number you can retain and control.
4. Only an authorized, one-session, SMS-only use without future reuse or important recovery needs can receive the qualified temporary-access guidance.

No result verifies a number, a platform's eligibility policy, inventory, delivery or acceptance. A successful SMS today does not promise access later. The tool does not receive SMS, buy numbers, process payments or bypass account controls.

## Privacy and code

The tool has no network requests, storage, cookies, analytics, external fonts or third-party assets. Answers are held only in JavaScript memory. There are no free-text fields. Clicking an optional reference link opens that public website; its own privacy policy applies there. A host serving these files may maintain its ordinary access logs.

- `decision.js`: pure decision logic and allowed choices.
- `copy.js`: the eight language versions.
- `app.js`: accessible form and result rendering using text nodes.
- `index.html` / `style.css`: standalone interface and no-JavaScript explanation.
- `test.mjs`: all 162 combinations and additional behavior checks.

Keyboard users can tab to each radio group, use arrow keys to select, and activate the result button. Required questions use browser validation. The result receives focus when displayed. Narrow screens use one option per row.

## Project relationship

ReceiveSMSGo maintains this independent educational tool and the hosted React version. ReceiveSMSGo is a commercial single-use SMS service; it does not offer voice calls, permanent numbers or long-term rentals. The tool is useful without visiting or purchasing from ReceiveSMSGo and does not recommend a purchase when the access needs do not match. It makes no claim of affiliation with destination platforms.

Text and translations were prepared with AI assistance. Feedback on unclear wording, translations and decision cases is welcome. Do not include real phone numbers, messages, verification codes or account credentials in public issues.

## License

MIT. See [LICENSE](LICENSE). This software license does not grant rights to the ReceiveSMSGo name or marks.
