namespace XML_Converter.Contracts
{
    public interface IStudent
    {
        string Username { get; }

        string FirstName { get; }

        string MiddleName { get; }

        string LastName { get; }

        string Email { get; }

        string Password { get; }

        string Cohort { get; }
    }
}
