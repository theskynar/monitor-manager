const { Client } = require('@elastic/elasticsearch');
const config = require('../config');

/**
 *Monitor repository
 *
 * @class MonitorRepository
 */
class MonitorRepository {
    /**
     * Creates an instance of MonitorRepository.
     *
     * @memberof MonitorRepository
     */
    constructor() {
        this._client = new Client({
            cloud: {
                id: config.elasticId,
                username: config.elasticUser,
                password: config.elasticPass
            }
        });
    }

    /**
     * Start creating index.
     *
     * @memberof MonitorRepository
     */
    async start() {
        const res = await this._client.ping();

        if (res.statusCode === 200) {
            console.log('Elastic connected successfuly');
        }
        
        await this.createIndex();
    }

    /**
     * Create index.
     *
     * @returns
     * @memberof MonitorRepository
     */
    async createIndex() {
        try {
            const exists = await this._client.indices.exists({
                index: 'monitor'
            });
            
            if (exists.statusCode === 200) {
                return;
            }
            
            const res = await this._client.indices.create({
                index: 'monitor',
                body: {
                    mappings: {
                        properties: {
                            deviceId: {
                                type: 'text'
                            },
                            userId: {
                                type: 'text'
                            },
                            temperature: {
                                type: 'double'
                            },
                            humidity: {
                                type: 'double'
                            },
                            created: {
                                type: 'date'
                            }
                        }
                    }
                }
            });
    
            if (res.statusCode === 200) {
                console.log('Monitor index creates successfuly');
            }
        } catch (e) {
            console.log('Error on initialize elastic: ', e.body.error);
        }
    }

    /**
     * Index event.
     *
     * @param {*} event
     * @returns
     * @memberof MonitorRepository
     */
    async indexEvent(event) {
        const res = await this._client.index({
            index: 'monitor',
            body: {
                ...event,
                created: new Date()
            }
        });

        return res.body;
    }
}

module.exports = new MonitorRepository();