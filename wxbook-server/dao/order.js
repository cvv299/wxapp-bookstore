const $sqlQuery = require('./sqlCRUD').order;
const _ = require('./query');

const order = {

    queryById : function (oid) {
        return _.query($sqlQuery.queryById,[oid]);
    },
    buyBook : function (uid,oprice,bkid) {
        return _.query($sqlQuery.buyBook,[uid,oprice,bkid]);
    },
};
module.exports = order;