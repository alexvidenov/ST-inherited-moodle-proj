using OfficeOpenXml;
using System.Text;
using XML_Converter;
using XML_Converter.Contracts;

namespace Moodle
{
    public partial class Form1 : Form
    {
        private string filePath = "";
        private string name = "";

        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            openFileDialog1.InitialDirectory = "C://Desktop";
            //Your opendialog box title name.
            openFileDialog1.Title = "Select file to be upload.";
            //which type file format you want to upload in database. just add them.
            openFileDialog1.Filter = "Select Valid Document(*.pdf; *.doc; *.xlsx; *.html)|*.pdf; *.docx; *.xlsx; *.html";
            //FilterIndex property represents the index of the filter currently selected in the file dialog box.
            openFileDialog1.FilterIndex = 1;
            try
            {
                if (openFileDialog1.ShowDialog() == System.Windows.Forms.DialogResult.OK)
                {
                    if (openFileDialog1.CheckFileExists)
                    {
                        filePath = Path.GetFullPath(openFileDialog1.FileName);
                        name = Path.GetFileName(filePath);
                        label1.Text = name;
                    }
                }
                else
                {
                    MessageBox.Show("Please Upload document.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void ImportXLS(List<IStudent> students)
        {
            using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(filePath)))
            {
                var myWorksheet = xlPackage.Workbook.Worksheets.First(); //select sheet here
                var totalRows = myWorksheet.Dimension.End.Row;
                var totalColumns = myWorksheet.Dimension.End.Column;

                for (int rowNum = 1; rowNum <= totalRows; rowNum++) //select starting row here
                {
                    var row = myWorksheet.Cells[rowNum, 1, rowNum, totalColumns].Select(c => c.Value == null ? string.Empty : c.Value.ToString());

                    string[] data = row.ToArray();

                    if (!string.IsNullOrEmpty(data[0]) && rowNum != 1)
                    {
                        string username = data[4];
                        string[] name = data[6].Split(" ", StringSplitOptions.RemoveEmptyEntries).ToArray();
                        string email = data[0];
                        string password = data[4];
                        string cohort = $"{data[3]} / {data[7]} / {DateTime.Now.Year}";

                        IStudent student = new Student(username, name[0], name[1], name[2], email, password, cohort);
                        students.Add(student);
                    }
                }
            }
        }

        private void ConvertToCSV(List<IStudent> students)
        {
            string[] parameters = new string[] { "username", "firstname", "middlename", "lastname", "email", "password", "cohort1" };
            var csv = new StringBuilder();

            csv.AppendLine(string.Join(",", parameters));
            foreach (var student in students)
            {
                csv.AppendLine(student.ToString());
            }

            Directory.CreateDirectory("CSV Files");
            File.WriteAllText("CSV Files/export.csv", csv.ToString().TrimEnd());
        }

        private void button2_Click(object sender, EventArgs e)
        {

            List<IStudent> students = new List<IStudent>();

            ImportXLS(students);

            ConvertToCSV(students);

            label2.Text = "Saved successfully!";
        }
    }
}