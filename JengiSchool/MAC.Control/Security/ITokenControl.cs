using MAC.Control.Model;
using System.Collections.Generic;

namespace MAC.Control.Security
{
    public interface ITokenControl
    {
        ResponseContainerModel GenerateJwtToken(Dictionary<string, string> dictTokenParam, Dictionary<string, string> dictClaims);
        string IsTokenJwtValid(string paramkeytoken, string token);
        string GetClaimValueByToken(string paramkeytoken, string tipoclaim, string token);
    }
}
