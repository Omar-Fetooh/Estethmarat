import { Router } from 'express';
import { errorHandler } from './../middlewares/error-handling.middleware.js';
import { Investor } from '../../DB/models/investor.model.js';
import { Company } from '../../DB/models/company.model.js';
import { supportOrganization } from '../../DB/models/supportOrganization.model.js';
import { CharityOrganization } from '../../DB/models/charityOrganization.model.js';
import { SearchResult } from '../../DB/models/searchResult.model.js';
import { Post } from '../../DB/models/post.model.js';
export const searchRouter = Router();

const getSearchResult = errorHandler(async (req, res, next) => {
  const { name } = req.query;
  let userResults, arrOfPosts;
  if (name) {
    const investors = await Investor.find({
      fullEnglishName: { $regex: name, $options: 'i' },
    });
    const companies = await Company.find({
      companyName: { $regex: name, $options: 'i' },
    });
    const supportOrganizations = await supportOrganization.find({
      name: { $regex: name, $options: 'i' },
    });
    const charityOrganizations = await CharityOrganization.find({
      name: { $regex: name, $options: 'i' },
    });

    userResults = [
      ...investors,
      ...companies,
      ...supportOrganizations,
      ...charityOrganizations,
    ];
    arrOfPosts = await Post.find({
      title: {
        $regex: name,
        $options: 'i',
      },
    });
  }
  if (!name) {
    const investors = await Investor.find();
    const companies = await Company.find();
    const supportOrganizations = await supportOrganization.find();
    const charityOrganizations = await CharityOrganization.find();
    const posts = await Post.find();
    userResults = [
      ...investors,
      ...companies,
      ...supportOrganizations,
      ...charityOrganizations,
      ...posts,
    ];
    userResults.sort((a, b) => b.createdAt - a.createdAt);
  }

  if (req.body.accountType === 'منشور') {
    userResults = [...arrOfPosts];
  } else {
    userResults = userResults.filter((obj) => {
      if (req.body.accountType === 'مستثمر' && obj.role === 'investor') {
        return obj;
      } else if (req.body.accountType === 'شركة' && obj.role === 'company') {
        return obj;
      } else if (
        req.body.accountType === 'منظمة خيرية' &&
        obj.role === 'charityOrganization'
      ) {
        return obj;
      } else if (
        req.body.accountType === 'منظمة داعمة' &&
        obj.role === 'supportOrganization'
      ) {
        return obj;
      } else if (Object.keys(req.body).length === 0) {
        return obj;
      }
    });
  }
  await SearchResult.deleteMany({});
  await SearchResult.create({
    query: name,
    result: JSON.stringify(userResults),
  });

  if (userResults[0]?.role === 'supportOrganization') {
    userResults = userResults.filter((obj) => {
      if (
        (req.body.organizationType === undefined ||
          obj.organizationType === req.body.organizationType) &&
        (req.body.supportCountry === undefined ||
          obj.country === req.body.supportCountry) &&
        (req.body.supportedProjectFields === undefined ||
          req.body.supportedProjectFields.every((item) =>
            obj.supportedProjectFields.includes(item)
          ))
      ) {
        return obj;
      }
    });
  } else if (userResults[0]?.role === 'charityOrganization') {
    userResults = userResults.filter((obj) => {
      if (
        (req.body.charityCountry === undefined ||
          obj.country === req.body.charityCountry) &&
        (req.body.charityOrganizationType === undefined ||
          obj.organizationType === req.body.charityOrganizationType) &&
        (req.body.charityFieldsSupported === undefined ||
          req.body.charityFieldsSupported.every((item) =>
            obj.projectTypes.includes(item)
          ))
      ) {
        return obj;
      }
    });
  } else if (userResults[0]?.role === 'company') {
    userResults = userResults.filter((obj) => {
      if (
        (req.body.businessField === undefined ||
          req.body.businessField.every((item) =>
            obj.companyField.includes(item)
          )) &&
        (req.body.country === undefined || obj.country === req.body.country) &&
        (req.body.stage === undefined || obj.state === req.body.stage) &&
        (req.body.wantedServices === undefined ||
          req.body.wantedServices.every((item) =>
            Object.keys(obj.requiredServices).includes(item)
          )) &&
        (req.body.rangeTo === undefined ||
          req.body.rangeFrom === undefined ||
          (obj.investmentAmount >= Number(req.body.rangeFrom) &&
            obj.investmentAmount <= Number(req.body.rangeTo)))
      ) {
        return obj;
      }
    });
  }
  res.status(200).json({
    status: 'success',
    length: userResults.length,
    userResults,
  });
});
// const filterBody = errorHandler(async (req, res, next) => {
//   const searchedResult = await SearchResult.find();
//   let arrResult = JSON.parse(searchedResult[0].result);
//   const arrOfPosts = await Post.find({
//     title: {
//       $regex: searchedResult[0].query,
//       $options: 'i',
//     },
//   });
//   if (req.body.accountType === 'منشور') {
//     arrResult = [...arrOfPosts];
//   } else {
//     arrResult = arrResult.filter((obj) => {
//       if (req.body.accountType === 'مستثمر' && obj.role === 'investor') {
//         return obj;
//       } else if (req.body.accountType === 'شركة' && obj.role === 'company') {
//         return obj;
//       } else if (
//         req.body.accountType === 'منظمة خيرية' &&
//         obj.role === 'charityOrganization'
//       ) {
//         return obj;
//       } else if (
//         req.body.accountType === 'منظمة داعمة' &&
//         obj.role === 'supportOrganization'
//       ) {
//         return obj;
//       } else if (Object.keys(req.body).length === 0) {
//         return obj;
//       }
//     });
//   }

//   if (arrResult[0]?.role === 'supportOrganization') {
//     arrResult = arrResult.filter((obj) => {
//       if (
//         (req.body.organizationType === undefined ||
//           obj.organizationType === req.body.organizationType) &&
//         (req.body.supportCountry === undefined ||
//           obj.country === req.body.supportCountry) &&
//         (req.body.supportedProjectFields === undefined ||
//           JSON.stringify(obj.supportedProjectFields) ===
//             JSON.stringify(req.body.supportedProjectFields))
//       ) {
//         return obj;
//       }
//     });
//   } else if (arrResult[0]?.role === 'charityOrganization') {
//     arrResult = arrResult.filter((obj) => {
//       if (
//         (req.body.charityCountry === undefined ||
//           obj.country === req.body.charityCountry) &&
//         (req.body.charityOrganizationType === undefined ||
//           obj.organizationType === req.body.charityOrganizationType) &&
//         (req.body.charityFieldsSupported === undefined ||
//           JSON.stringify(obj.projectTypes) ===
//             JSON.stringify(req.body.charityFieldsSupported))
//       ) {
//         return obj;
//       }
//     });
//   } else if (arrResult[0]?.role === 'company') {
//     arrResult = arrResult.filter((obj) => {
//       if (
//         (req.body.businessField === undefined ||
//           JSON.stringify(obj.companyField) ===
//             JSON.stringify(req.body.businessField)) &&
//         (req.body.country === undefined || obj.country === req.body.country) &&
//         (req.body.stage === undefined || obj.state === req.body.stage) &&
//         (req.body.wantedServices === undefined ||
//           JSON.stringify(Object.keys(obj.requiredServices)) ===
//             JSON.stringify(req.body.wantedServices)) &&
//         (req.body.rangeTo === undefined ||
//           req.body.rangeFrom === undefined ||
//           (obj.investmentAmount >= Number(req.body.rangeFrom) &&
//             obj.investmentAmount <= Number(req.body.rangeTo)))
//       ) {
//         return obj;
//       }
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     length: arrResult.length,
//     arrResult,
//   });
// });

searchRouter.post('/', getSearchResult);
// searchRouter.post('/', filterBody);
