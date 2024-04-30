module.exports = {
    apps: [
        {
        name: 'WSAEvents',
        port: '4224',
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs',
        }
    ]
}