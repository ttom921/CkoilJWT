using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Security.Claims;

namespace WebApi.Providers
{
    //基本的Access Token發放。
    public class ApplicationOAuthProvider: OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            string clientId = string.Empty;
            string clientSecret = string.Empty;
            //Client client = null;

            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }
        }
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            // 建立identity，用於API中授權方式 EX:[Authorize(Roles = "Administrators, Member")]
            // 驗證方式
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);

            if(context.UserName=="admin" && context.Password== "admin")
            {
                //playload
                identity.AddClaim(new Claim(ClaimTypes.Role, "admin"));
                identity.AddClaim(new Claim("username", "admin"));
                identity.AddClaim(new Claim(ClaimTypes.Name, "Sourav Mondal"));
                identity.AddClaim(new Claim("Point", "5000"));
               
                context.Validated(identity);
            }else if ( context.UserName=="user" && context.Password=="user")
            {
                //playload
                identity.AddClaim(new Claim(ClaimTypes.Role, "user"));
                identity.AddClaim(new Claim("username", "user"));
                identity.AddClaim(new Claim(ClaimTypes.Name, "tom tang湯"));
                identity.AddClaim(new Claim("Point", "10"));
               
                context.Validated(identity);
            }
            else
            {
                context.SetError("invalid_grant", "Provided username and password is incorrect");
                return;
            }

        }
    }
}