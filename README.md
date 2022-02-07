# Mynfo


## Mynfo Overview

Simple CMS(Contents Management System) which use **MarkDown** notation and **GitHub**.


## Environment values

- Set following two values to enable basic authentication:

  - `BASIC_USERNAME`

    - Username of basic authentication

  - `BASIC_PASSWORD`

    - Password of basic authentication


## How to run on localhost

- Fork `https://github.com/dotnsf/mynfo.git` to your Github repository.

- `$ git clone https://github.com/yourname/mynfo.git`

- `$ cd mynfo`

- `$ npm install`

- (Edit your contents under `md/` folder)

- (Add/Edit contents under `public/` folder, if needed.)

- `$ node app`

- `http://localhost:8080/`


## How to create application and CICD pipeline in heroku

- Create account(Sign up) in [heroku](https://www.heroku.com/).

- Sign in to [herou](https://www.heroku.com/).

- Select `New` - `Create new app` on upper-right.

![image01](//mynfo.herokuapp.com/img/system01.png)

- Input available `App name`(**myinfo** in this case), and choose `region`(**United States** in this case). Then you can click `add to pipeline...` button.

![image02](//mynfo.herokuapp.com/img/system02.png)

- At `Choose a pipeline` section, select `+ Create new pipeline`.

![image03](//mynfo.herokuapp.com/img/system03.png)

- You can input `Name the pipeline`(**mynfo-pipeline** in this case), and choose a `stage`(**production** in this case). Then you can click `Create app` button.

![image04](//mynfo.herokuapp.com/img/system04.png)

- Pipeline is created, and connected to your application. Now you can select `Deployment method`. In this case, let's assume we want to deploy application whenever github repository would be updated. So you should select `GitHub` icon.

![image05](//mynfo.herokuapp.com/img/system05.png)

- You need to specify GitHub repository to connect. So let's input repository name, **mynfo**, and click `Search` button.

![image06](//mynfo.herokuapp.com/img/system06.png)

- You will see your respository as `(yourname)/myinfo`. Let's choose this one, and click `Connect` button.

![image07](//mynfo.herokuapp.com/img/system07.png)

- Now you can see this pipeline has been connected to your github repository.

![image08](//mynfo.herokuapp.com/img/system08.png)

- As a final step of preparation, you need to specify `automatic deploy` configuration. In this case, we would choose **main** branch as a target, and click `Enable Automatic Deploys` button.

![image09](//mynfo.herokuapp.com/img/system09.png)

- Now you can confirm that your pipeline is connected to your main branch of GitHub repository.

![image10](//mynfo.herokuapp.com/img/system10.png)

- At this moment, you can see your pipeline(**mynfo-pipeline**) is connected to your main branch of GitHub repository in your pipeline setting too.

![image11](//mynfo.herokuapp.com/img/system11.png)


## How to update your contents(sample)

As a sample, you would add one new `test.md` file, and push it to main branch:

- In CLI,

  - `$ cd mynfo`

  - `$ echo "# テスト" > md/test.md`

  - `$ git add md/test.md`

  - `$ git commit -m 'md/test.md added.'`

  - `$ git push -u origin main`

  - (You can do this from GitHub web console too.)

- Then you can see your pipeline would be run automatically:

![image12](//mynfo.herokuapp.com/img/system12.png)

- After deployment process, you will see that new application would be deployed. You can open new application from `Open app` button:

![image13](//mynfo.herokuapp.com/img/system13.png)

- You will see current(new) application. You can see `test.md`, which has been just added, in menu.

![image14](//mynfo.herokuapp.com/img/system14.png)

- If you click `test.md`, you will see and confirm contents of `test.md` file.

![image15](//mynfo.herokuapp.com/img/system15.png)



## How to update your contents

- (Edit your contents under `md/` folder from CLI or Web console.)

- (Add/Edit contents under `public/` folder, if needed.)

- Git commit and push your change:

  - In CLI,

    - `$ cd mynfo`

    - `$ git add .`

    - `$ git commit -m '(commit comment)'`

    - `$ git push -u origin main`

  - In Web console,

    - Navigate to folder( `md/` for new contents, or `public/` for new resource).

    - Click `Add file` button, and choose `Create new file` or `Upload files`.

![image16](//mynfo.herokuapp.com/img/system16.png)

    - Edit new file, or upload new file. And click `Commit changes` button to commit to `main` branch.

![image17](//mynfo.herokuapp.com/img/system17.png)


## Licensing

This code is licensed under MIT.


## Copyright

2022  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
