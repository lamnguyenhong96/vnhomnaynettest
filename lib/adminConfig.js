/**
 * Admin Config
 */

AdminConfig = {
    name: "VNHomnay",
    collections: {
        Channels: {
            icon: 'comment',
            tableColumns: [
                {label: 'Name', name: 'name'},
                {label: 'Color', name: 'colorPicker'},
            ],
            showWidget: true,
            showEditColumn: true, // Set to false to hide the edit button. True by default.
            showDelColumn: true // Set to false to hide the edit button. True by default.
        },
        Tags: {
            icon: "tags",
            tableColumns:[
                {label: 'Name', name: 'name'}
            ],
            showWidget: true,
            showEditColumn: true, // Set to false to hide the edit button. True by default.
            showDelColumn: true // Set to false to hide the edit button. True by default.
        }
    }
};