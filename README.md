<div align="center">
  <h2>Schoacher (API)</h2>

  ### Online portal where employer & teacher can manage their profile, <br /> employer can add jobs and teachers can apply at jobs
  
  #### Teacher Portal
  ![Schoacher-Teacher-V1](https://user-images.githubusercontent.com/50201755/158044576-bb664a5b-c4cf-46db-a811-c76cc9b9a342.gif)
  
  #### Employer Portal
  ![Schoacher-School-V1](https://user-images.githubusercontent.com/50201755/158044579-f0b4d1ee-c231-4622-8908-2044521efb47.gif)

  <a href="https://schoacher.vercel.app" target="_blank">Live demo</a> | <a href="https://github.com/chavda-bhavik/schoacher" target="_blank">Frontend</a>
</div>


### Running Locally

### Setup
* Create postgress database named **schoacher** and **schoacher-test**
* Update database credentials in **ormconfig.js**

### Steps
- `git clone https://github.com/chavda-bhavik/schoacher-api.git`
- `yarn` (after navigating inside the directory)
- `yarn watch && yarn dev`

----

## About Schoacher-API

### Features
- Built on Typescript
- Tests written using **jest**
- Graphql Implementation with Apollo Server
- `Automatic data validation using Yup`
- File Uploading to [Cloudinary](https://cloudinary.com)
- Abstracted Database functions to easy the Development
- Linting and formatting with **eslint** and **prettier**

## Problems Face and Solved
- Providing CORS enabled secure authetication using cookie was challenging

## Technologies 🤖
- [apollographql](https://www.apollographql.com/), [expressjs](https://expressjs.com/) to build GraphQL server
- [type-graphql](https://typegraphql.com) to Build Schema and operations from Classes
- [typeorm](https://typeorm.io/#/) to enable lightweight ORM
- [JWT](https://jwt.io) with cookies for Authentication
- [Yup](https://github.com/jquense/yup) for Schema validation
- [Cloudinary](https://cloudinary.com) for storing documents
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) to encrypt password
- [JestJS](https://jestjs.io), [apollo-integration-testing](https://www.npmjs.com/package/apollo-server-integration-testing) to write unit tests

------------
