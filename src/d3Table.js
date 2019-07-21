function createTable(div,data,options){

    // data = [{"2010":22.0,"2011":29.0,"2012":23.0,"2013":17.0,"2014":20.0},
    //  {"2010":27.0,"2011":23.0,"2012":26.0,"2013":19.0,"2014":17.0},
    //  {"2010":29.0,"2011":24.0,"2012":21.0,"2013":21.0,"2014":10.0}]
    
    // options = {
    //  sort: true,
    //  table: {class: 'table table-sm'},
    //  thead: {class: 'thead-light'},
    //  footer: {columns: {1: 'sum', 2: 'mean', 3: 'sum'}}
    // }

    let sort = options.sort || false
    let tableOptions = options.table || {class: 'table'}
    let tbodyOptions = options.tbody || {class: ''}
    let theadOptions = options.thead || {class: ''}
    let footer = options.footer || false

    // add table
    let container = d3.select('#' + div)
    container.selectAll('table').remove()
    let table = container.append('table').attr('class', tableOptions.class)
    let tbody = table.append('tbody').attr('class', tbodyOptions.class)
    let thead = table.append('thead').attr('class', theadOptions.class)

    // check if we have some data
    if (!data || data.length == 0){
        tbody.append('tr')   
            .append('td')
            .text('No data')
            .style('font-size','12px')
            .style('font-style','italic')
            .style('background-color','#f5c6cb')
            .style('text-align','center') 
        return
    }

    // column names to list
    let columns = []
    data.forEach(row => {
        Object.keys(row).forEach(col => {
            if(!columns.includes(col)){columns.push(col)}
        })
    })

    // add headers
    thead.append('tr')
    let headers = thead.select('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(d => d)

    if (sort){
        headers.append('i')
            .attr('id','sort_up')
            .attr('class','fas fa-long-arrow-alt-up ml-2')
            .style('opacity','0.2')  
        headers.append('i')
            .attr('id','sort_down')
            .attr('class','fas fa-long-arrow-alt-down')
            .style('opacity','0.2')

        headers.on('click', function (d) {
            if (this.className != 'ascending'){
                rows.sort(function(a, b) {return d3.ascending(a[d],b[d])})
                this.className = 'ascending'
                headers.selectAll('#sort_up').style('opacity','0.2')
                headers.selectAll('#sort_down').style('opacity','0.2')
                d3.select(this).select('#sort_up').style('opacity','0.6')
            } else {
                rows.sort(function(a, b) {return d3.descending(a[d],b[d])})
                this.className = 'descending'
                headers.selectAll('#sort_up').style('opacity','0.2')
                headers.selectAll('#sort_down').style('opacity','0.2')
                d3.select(this).select('#sort_down').style('opacity','0.6')
            }
        })

        headers.on('mouseover',function(d) {
              d3.select(this).style('cursor', 'pointer')
            })

        headers.on('mouseout', function(d) {
              d3.select(this).style('cursor', 'default') 
            })
    }
     
    // add rows
    let rows = tbody.selectAll('tr')
        .data(data, d => d)
        .enter()
        .append('tr')

    // add cells
    rows.selectAll('td')
        .data(function (d) {
            return columns.map(function (h) {
                return {name: h, value: d[h]}
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value})

    // add footer
    if (footer){
        // aggregate columns
        columns_total = []
        footer_columns = Object.keys(footer.columns)|| []
        for (i in columns){
            if (footer_columns.includes(i)){
                columns_total[i] = [0]
                let count = 0
                data.forEach(row => {
                    if (!(isNaN(parseFloat(row[columns[i]])))){
                        columns_total[i][0] += row[columns[i]]
                        count += 1
                    }
                })
                if (footer.columns[i] == 'mean' && count != 0){
                    columns_total[i][0] = columns_total[i][0] / count
                }
                columns_total[i][0] = Math.round(columns_total[i][0] * 10) / 10
            }
            else {         
                columns_total[i] = ['']
            }
        }

        let tfoot = table.append('tfoot').attr('class', theadOptions.class)
        tfoot.append('tr')
        tfoot.select('tr')
            .selectAll('th')
            .data(columns_total)
            .enter()
            .append('th')
            .text(d => d)
    }
}
