# TimeBudget

### Description
_TimeBudget_ (working title) is an experimental tool to help you be more intentional with how you spend your time.

Inspired by ideas from books like [_Deep Work_](https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692) and _[Indistractable](https://www.amazon.com/Indistractable-Control-Your-Attention-Choose/dp/1526610205/ref=sr_1_2?crid=21YWJQG9A6K8P&dib=eyJ2IjoiMSJ9.aUI1qyZWzddZCDoFa9ilDZ_Trxbg61qIqiPPgQdXca5s5r4xccvCMd-cwY4iNjULmE0EiQ1hLrVa23R4nHworzMFS0nT5YUoQSVjJ2icrjcLwcSUzqaHDh4VKTID1ctLJbGr7vHUYKfuUW2hwqj3Ee3f1sDj8L3acXaT5zMenA2qbIkjiU6mPstjqBF66yua6QCn86NVaR7Ee3Br04q2y-iIRz7mBIUarHt5uT4kAOo.5v1WdTMjdcjAiJ0IaDAQ3lKOnKiLxgHlT9Fx7z10Vsk&dib_tag=se&keywords=indistractable&qid=1717607369&s=books&sprefix=indis%2Cstripbooks-intl-ship%2C261&sr=1-2)_, _TimeBudget_ aims to provide an intuitive interface that makes the process of [time blocking](https://todoist.com/productivity-methods/time-blocking) **easier** and **more effective**.

### Demo

_TimeBudget_ is still very early in development but an MVP can be demoed [here](https://timeblock.netlify.app/). There is no backend yet so all data is stored locally in your browser.


### Features

#### Frictionless Time Blocking
A key design goal is to make creating timeblocks as frictionless as possible.

- Unlike events in calendar apps like google calendar, only one time block can occupy a period of time.
- Collision detection logic ensure that time blocks can easily be created beside eachother without overlapping.
- click and drag to set the duration of a time block
- Type ahead to select existing activities or create new if activity does not exist.

https://github.com/eamonnmg/time-manager/assets/6747264/041c331a-2704-414a-b56f-ec4642f843b8

*Timeblock existing activity*

https://github.com/eamonnmg/time-manager/assets/6747264/a0c35f7f-b294-49af-8a9a-52bfc9bd7dbf

*Timeblock new activity*

#### Budgets and Nested Activities

The next goal of the app is to help you _decide_ how to spend your time. 

- This is done by intentionally setting a budget for different types of activities.

- When a budget is created and activated, the app will show you how much time you have left to spend on that activity.

- To make this more powerful, activities can be "nested" within each to create a hierarchy of activities. This allows you to create a budget of high level activities (e.g. "exercise", "work", "social" )  and then contribute to the budget by time blocking more specific activities (e.g. "running", "email", "meeting friends").


### Technologies

The core app is mostly with Typescript, Vue 3, and Tailwind CSS.

[D3.js](https://d3js.org/) was used to implement the calendar view on the plan page. Specifically its [timescale functions](https://d3js.org/d3-scale/time) were used to map time to absolute pixels.

[Date-fns](https://date-fns.org/) is used for date manipulation.

[Pinia](https://pinia.vuejs.org/) is used for global state management.

[HeadlessUi](https://headlessui.com/v1/vue), [TailwindUI](https://tailwindui.com/) and [DaisyUI](https://daisyui.com/) are used for quickly building components.


### Roadmap


- **Persist data**. The plan here is to adopt a [local first](https://www.inkandswitch.com/local-first/) approach and use a thin sync layer to sync data across devices while keeping business logic in the client.
- **Drag and drop** time blocks to move them around.
- **Resize** time blocks by dragging the edges.
- **Reports**: record if you actually spent time on the activities you planned. 


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```