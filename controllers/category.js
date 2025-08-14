const prisma = require("../config/prisma");


exports.createCategory = async(req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name }
    });

    res.send(category);  
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getCategory = async(req, res) => {
  try {
    const category = await prisma.category.findMany()
    res.send(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  } 
}

exports.deleteCategory = async(req, res) => { 
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: { id: Number(id) }
    });
    res.send('Category deleted successfully');
  } catch (err) {     
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  } 
}
