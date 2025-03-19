using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace BloggerApi.BasicAuth.UseCases.Util;

public static class PasswordHasher
{
    private static byte[] salt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    public static string Hash(string password)
    {
        byte[] hashBytes = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100_000,
            numBytesRequested: 256 / 8
        );
        string hash = Convert.ToBase64String(hashBytes);
        return hash;
    }
}
