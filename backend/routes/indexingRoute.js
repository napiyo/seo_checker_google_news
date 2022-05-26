const express = require('express');
const { checkIndex } = require('../checkIndex');
const Router = express.Router();

Router.route('/checkIndexing').get(checkIndex)

module.exports =Router;