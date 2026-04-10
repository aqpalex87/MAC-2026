using MAC.DTO.Dtos;
using FluentValidation;

namespace MAC.API.Validations
{
    public class FlujoCajaDetalleValidator: AbstractValidator<FlujoCajaDetalleDto>
    {
        public FlujoCajaDetalleValidator()
        {
            RuleFor(fcd => fcd.CodItem)
                .Matches("^FCD[0-9]{3}$");

            RuleFor(fcd => fcd.MontosPlazo)
                .Must(mp => mp != null && mp.Count > 0)
                .WithMessage("Debe incluir los montos del plazo.");

            RuleForEach(fcd => fcd.MontosPlazo)
                .SetValidator(new MontoPlazoValidator());
        }
    }
}
