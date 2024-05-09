const express = require('express')
const galleryRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const gallerysController = require('../controller/gallerys.controller')
//const auth = require('../common/authentication');

galleryRouter.post('/createGallery', gallerysController.createGallery);
galleryRouter.post('/updateGalleryById/:id', gallerysController.updateGalleryById);
galleryRouter.post('/deleteGalleryById/:id', gallerysController.deleteGalleryById);
galleryRouter.get('/findAllGallerys', gallerysController.findAllGallerys);
galleryRouter.get('/getGalleryById/:id', gallerysController.getGalleryById);
galleryRouter.post('/getPaginateGallery', gallerysController.getPaginateGallery);

module.exports = galleryRouter