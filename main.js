function compareFiles() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (file1 && file2) {
        const reader1 = new FileReader();
        const reader2 = new FileReader();

        reader1.onload = function () {
            reader2.onload = function () {
                const sql1 = reader1.result;
                const sql2 = reader2.result;

                const differences = compareSQLTables(sql1, sql2);
                displayDifferences(differences);
            };

            reader2.readAsText(file2);
        };

        reader1.readAsText(file1);
    }
}

function compareSQLTables(sql1, sql2) {
    const parser = new SqlParser.Parser();

    const parsedSql1 = parser.feed(sql1).toCompactJson();
    const parsedSql2 = parser.feed(sql2).toCompactJson();

    // Extract table structures from the parsed SQL
    const tables1 = extractTableStructures(parsedSql1);
    const tables2 = extractTableStructures(parsedSql2);

    // Compare the table structures and find differences
    const differences = findDifferences(tables1, tables2);

    return differences.length === 0 ? "No differences found in table structures." : differences.join('\n');
}

function extractTableStructures(parsedSql) {
    const tables = {};
    parsedSql.forEach(statement => {
        if (statement.type === 'create' && statement.entity === 'table') {
            tables[statement.name] = statement;
        }
    });
    return tables;
}

function findDifferences(tables1, tables2) {
    const differences = [];

    for (const tableName in tables1) {
        if (!tables2[tableName]) {
            differences.push(`Table '${tableName}' exists in File 1 but not in File 2.`);
        } else if (JSON.stringify(tables1[tableName]) !== JSON.stringify(tables2[tableName])) {
            differences.push(`Table '${tableName}' has differences between File 1 and File 2.`);
        }
    }

    for (const tableName in tables2) {
        if (!tables1[tableName]) {
            differences.push(`Table '${tableName}' exists in File 2 but not in File 1.`);
        }
    }

    return differences;
}

function displayDifferences(differences) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = differences.join('\n');
}