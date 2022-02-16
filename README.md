# Mynfo


## Mynfo Overview

Simple CMS(Contents Management System) which use **MarkDown** notation and **GitHub**.


---

## Environment values

- Set following two values to enable basic authentication:

  - `BASIC_USERNAME`

    - Username of basic authentication

  - `BASIC_PASSWORD`

    - Password of basic authentication

- Set following two values to link to contents page in GitHub:

  - `GITHUB_REPO_URL`

    - URL of your GitHub contents

  - `GITHUB_BRANCH`

    - Branch name of your GitHub contents

- Set following values if needed:

  - `CONTENTS_TITLE`

    - Title of your site(default: "Mynfo")

  - `CONTENTS_IMAGE_URL`

    - Image URL of your application icon(default: "/img/icon.png")

  - `REVERSE_FILES`

    - Reverse files/folders order(default: "", set "1" to enable.)

  - `BOOTSTRAP_THEME`

    - Bootstrap color theme(default: "warning")

- You can edit `settings.js` instead of setting environment values.


---

## How to run and test (on localhost)

- Fork `https://github.com/dotnsf/mynfo.git` to your Github repository.

- `$ git clone https://github.com/yourname/mynfo.git`

- `$ cd mynfo`

- `$ npm install`

- (Edit your contents under `md/` folder)

- (Add/Edit contents under `public/` folder, if needed.)

- `$ node app`

- Access to `http://localhost:8080/`


---

## How to create application and CICD pipeline in heroku

- Create account(Sign up) in [heroku](https://www.heroku.com/).

- Sign in to [herou](https://www.heroku.com/).

- Select `New` - `Create new app` on upper-right.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system01.png"/>

- Input available `App name`(**myinfo** in this case), and choose `region`(**United States** in this case). Then you can click `add to pipeline...` button.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system02.png"/>

- At `Choose a pipeline` section, select `+ Create new pipeline`.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system03.png"/>

- You can input `Name the pipeline`(**mynfo-pipeline** in this case), and choose a `stage`(**production** in this case). Then you can click `Create app` button.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system04.png"/>

- Pipeline is created, and connected to your application. Now you can select `Deployment method`. In this case, let's assume we want to deploy application whenever github repository would be updated. So you should select `GitHub` icon.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system05.png"/>

- You need to specify GitHub repository to connect. So let's input repository name, **mynfo**, and click `Search` button.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system06.png"/>

- You will see your respository as `(yourname)/myinfo`. Let's choose this one, and click `Connect` button.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system07.png"/>

- Now you can see this pipeline has been connected to your github repository.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system08.png"/>

- As a final step of preparation, you need to specify `automatic deploy` configuration. In this case, we would choose **main** branch as a target, and click `Enable Automatic Deploys` button.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system09.png"/>

- Now you can confirm that your pipeline is connected to your main branch of GitHub repository.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system10.png"/>

- At this moment, you can see your pipeline(**mynfo-pipeline**) is connected to your main branch of GitHub repository in your pipeline setting too.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system11.png"/>


---

## How to update your contents(sample)

As a sample, you would add one new `test.md` file, and push it to main branch:

- (1-1) In CLI,

  - `$ cd mynfo`

  - `$ echo "# テスト" > md/test.md`

    - Create, Update, or Delete some .md files.

  - `$ git add md/test.md`

  - `$ git commit -m 'md/test.md added.'`

  - `$ git push -u origin main`

  - (You can do this from GitHub web console without `git` CLI too. See (1-2). )

  - Be sure that files in **remote** Git repository would be updated. Especially when you use automatic deploy pipeline, your application would use file directory in remote Git repository.


- (1-2) In Web console GUI,

  - Visit `https://github.com/yourname/mynfo` with Web Browser,

  - Click `md/` folder,

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system16.png"/>

  - Click `Add file` - `Create new file`,

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system17.png"/>

    - Create, Update, or Delete some .md files.

  - Name `test.md`, and input contents as `# テスト`,

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system18.png"/>

  - Input commit comment as `md/test.md added.`, and Click `commit new file` in bottom.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system19.png"/>

- (2) Then you can see your pipeline would be run automatically:

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system12.png"/>

- (3) After deployment process, you will see that new application would be deployed. You can open new application from `Open app` button:

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system13.png"/>

- (4) You will see current(new) application. 

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system14.png"/>

- (5) You can see `test.md` in hamberger-menu on top-right, which has been just added, in menu.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system15.png"/>

- (6) If you click `test.md`, you will see and confirm contents of newly added `test.md` file.

<img class="img90" src="https://raw.githubusercontent.com/dotnsf/mynfo/main/public/img/system20.png"/>


---

## How to run without heroku

- We believe **heroku might be one of the easiest platform** to deploy Mynfo, especially when to create automatic deploy pipeline. But you don't have to deploy to heroku.

- Use [GitHub Actions](https://github.co.jp/features/actions) to create CICD pipeline to deploy your application to your favorite server. You can use other CICD pipeline services with your GitHub or GitLab, .. also.

- If you don't want use Git like services, actually you don't have to. You can just download source code, and run it on your Node.js runtime. In this case, you can edit md/\*.md file in your server directory, but you can't control file versions with Git. No backups in Git too.


---

## Licensing

This code is licensed under MIT.


---

## Copyright

2022  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
