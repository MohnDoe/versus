const Ops = require('../modules/operators')

module.exports = {
    crud: {
        read: { // access to ONE clip data
            handler: (req, res, next) => {
            }
        },
        list: {
            handler: (req, res, next) => {
                
            }
        }
    },
    custom: [
        {
            url: '/new', // list of clips from this video
            method: 'get',
            handler: function(req, res, next) {
                Ops.battle.getNew()
                    .then(function(candidates) {
                        res.status(200).json({
                            status: 'success',
                            data: {
                                candidates: candidates
                            }
                        })
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            }
        },
    ]
};