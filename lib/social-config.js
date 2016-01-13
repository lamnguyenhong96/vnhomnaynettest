/**
 * Service config
 */

// facebook
ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1689546034651008',
    secret: 'f13bf5f816e12838f12f450ef2fd329c'
});

//twitter
ServiceConfiguration.configurations.remove({
    service: 'twitter'
});
ServiceConfiguration.configurations.insert({
    service: 'twitter',
    consumerKey: 'gJPo7BkpqIq5VX3v1XaL348an',
    secret: 'djQMxOVOcXp1nd588AQqJS5whUoaGFlAFUZXmqtDO1UqwSXzd0'
});

//google
ServiceConfiguration.configurations.remove({
    service: 'google'
});
ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: '569805592873-j1dckbpv63c12sp7o6ejh80em72ukt98.apps.googleusercontent.com',
    secret: '9FBtsPPUs7E_ZMVHEVpKkNgz'
});

//linkedin
ServiceConfiguration.configurations.remove({
    service: 'linkedin'
});
ServiceConfiguration.configurations.insert({
    service: 'linkedin',
    clientId: '75t2zgebonzacu',
    secret: '2btBcf5BGH3BEGKe'
});