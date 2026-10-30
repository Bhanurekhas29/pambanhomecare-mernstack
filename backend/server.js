const app = require('./src/app');
const { sequelize, PhysiotherapySection, PhysiotherapyTreatment } = require('./src/models');

const PORT = process.env.PORT || 5000;

// sync() creates missing tables but never adds columns to existing ones, so newer columns are added here
const addMissingColumns = async () => {
  const qi = sequelize.getQueryInterface();
  const wanted = [
    [PhysiotherapySection, 'description'],
    [PhysiotherapyTreatment, 'description'],
  ];
  for (const [Model, attr] of wanted) {
    const table = Model.getTableName();
    const columns = await qi.describeTable(table);
    const { field, ...definition } = Model.getAttributes()[attr];
    if (!columns[field]) await qi.addColumn(table, field, definition);
  }
};

sequelize
  .sync()
  .then(addMissingColumns)
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
