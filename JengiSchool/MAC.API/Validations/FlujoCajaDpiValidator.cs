using MAC.DTO.Dtos;
using FluentValidation;

namespace MAC.API.Validations
{
    public class FlujoCajaDpiValidator : AbstractValidator<FlujoCajaDpiDto>
    {
        public FlujoCajaDpiValidator()
        {
            RuleFor(fcd => fcd.IdParametroDpi).Matches("^DPI[0-9]{2}$");
        }
    }
}
