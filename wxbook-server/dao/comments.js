const $sqlQuery = require('./sqlCRUD').comment;
const _ = require('./query');

const comment = {
    queryById : function (bid) {
        return _.query($sqlQuery.queryById,[bid]);
    },
    addComment : function (skey,bookid,comment) {
        return _.query($sqlQuery.addComment,[bookid,bookid,comment,skey]);
    },
    queryComments: function (bkid) {
        return _.query($sqlQuery.queryComments,[bkid]);
    },
};
module.exports = comment;