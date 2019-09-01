export const cars = [{
    name: 'Lada',
    models: ["Granta", "Kalina", "Kalina 2", "Priora", "Vesta", "X-Ray", "4x4"]
}, {
    name: 'Toyota',
    models: ['Corola', 'Camry', 'Rav4', 'Land Cruiser', 'Prius', 'Yaris', 'Auris']
}, {
    name: 'Nissan',
    models: ['Juke', 'Murano', 'Qashqai', 'Terrano', 'X-Trail']
}, {
    name: 'Hyundai',
    models: ['Solaris', 'Accent', 'Coupe', 'Creta', 'Elantra',
        'Equus', 'Genesis', 'Getz', 'Grand Starex', 'Grandeur', 'H-1', 'i20', 'i30',
        'i30 N', 'i40', 'ix35', 'ix55', 'Lantra', 'Matrix14', 'Porter', 'Santa Fe', 'Sonata',
        'Starex', 'Terracan', 'Trajet', 'Tucson', 'Veloster', 'Verna']
}, {
    name: 'Kia',
    models: ['Rio', 'Cerato', 'Optima', 'Sportage', 'Cee\'d', 'Spectra', 'Sorento', 'Picanto']
}, {
    name: 'Renault',
    models: ['Logan', 'Duster', 'Kaptur', 'Arkana', 'Kangoo', 'Fluence', 'Laguna', 'Megane', 'Sandero', 'Clio', 'Latitude', 'Koleos']
}, {
    name: 'Chevrolet',
    models: ['Niva', 'Lanos', 'Aveo', 'Cruze', 'Lacetti', 'Spark', 'Orlando',]
}, {
    name: 'Volkswagen',
    models: ['Golf', 'Passat', 'Caddy', 'Caravelle', 'Polo', 'Jetta', 'Touareg', 'Tiguan']
}, {
    name: 'Ford',
    models: ['Focus', 'Mondeo', 'Kuga', 'Fiesta', 'Fusion']
}, {
    name: 'Mitsubishi',
    models: ['Lancer', 'Pajero', 'L200', 'Outlander', 'Asx']
}
];

export function defineOptions(value, select) {
    // console.log('value',value);
    cars.map(car => {
        // console.log(car.name, value);
        if (car.name === value) {
            car.models.map(model => {
                select.appendChild(new Option(model))
            })
        }
    })
}