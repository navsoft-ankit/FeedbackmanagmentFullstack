using MailKit.Net.Smtp;
using MimeKit;

public class EmailService : IEmailService
{
    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        try
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress("Feedback System", "ankitdas0412@gmail.com"));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            email.Body = new TextPart("html")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync("ankitdas0412@gmail.com", "ioyo rrvp nhbm uzkf");

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);

            Console.WriteLine("EMAIL SENT SUCCESSFULLY");
        }
        catch (Exception ex)
        {
            Console.WriteLine("EMAIL FAILED: " + ex.Message);
            throw;
        }
    }
}