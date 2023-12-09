using XML_Converter.Contracts;

namespace XML_Converter
{
    public class Student : IStudent
    {
        public string Username { get; private set; }

        public string FirstName { get; private set; }

        public string MiddleName { get; private set; }

        public string LastName { get; private set; }

        public string Email { get; private set; }

        public string Password { get; private set; }

        public string Cohort { get; private set; }

        public Student(string username, string firstname, string middlename, string lastname, string email, string password, string cohort)
        {
            this.Username = username;
            this.FirstName = firstname;
            this.MiddleName = middlename;
            this.LastName = lastname;
            this.Email = email;
            this.Password = password;
            this.Cohort = cohort;
        }

        public override string ToString()
        {
            return $"{this.Username},{this.FirstName},{this.MiddleName},{this.LastName},{this.Email},{this.Password},{this.Cohort}";
        }
    }
}
