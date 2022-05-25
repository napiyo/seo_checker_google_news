const express = require('express');
const { checkIndex } = require('../checkIndex');
const Router = express.Router();

Router.route('/checkIndexing/:domain').get(checkIndex)

module.exports =Router;