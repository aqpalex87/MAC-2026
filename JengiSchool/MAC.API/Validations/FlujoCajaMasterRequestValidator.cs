using MAC.Business.Entity.Layer.Utils;
using MAC.DTO.Dtos;
using FluentValidation;
using System.Linq;

namespace MAC.API.Validations
{
    public class FlujoCajaMasterRequestValidator : AbstractValidator<FlujoCajaMasterRequestDto>
    {
        public FlujoCajaMasterRequestValidator()
        {
            When(fc => fc.CodDestino == Destino.SOSTENIMIENTO, () =>
            {
                RulesForFlujoCajaMaestro();

                RuleFor(fc => fc.Guf).Must(guf => guf != null && guf.Count > 0)
                    .WithMessage("Debe tener al menos un Gasto de Unidad Familiar.");

                RuleFor(fc => fc.Guf).Must(guf => guf != null && guf.Sum(g => g.MontoActual) > 0)
                   .WithMessage("{PropertyName}: Total Gasto Mensual debe ser diferente de CERO y Negativo.");

                RulesForEsfa();

                RuleFor(fc => fc.Era).Must(era => era != null && era.Count > 0)
                  .WithMessage("Debe tener al menos un Estado de Resultados Agropecuarios.");

                When(fc => fc.Era.Find(i => i.CodItem == Era.EXCEDENTE_NETO).MontoActual == 0, () =>
                {
                    RuleFor(fc => fc.ComentarioGuf).NotEmpty()
                        .WithMessage("{PropertyName} es obligorio si el Excedente Neto es 0.");
                });
               

                RuleForEach(fc => fc.Era).SetValidator(new FlujoCajaEraValidator());
                
                RulesForFcd();
            });
            
        }

        private void RulesForFlujoCajaMaestro()
        {
            RuleFor(fc => fc.ComentarioGuf).MaximumLength(500);
            RuleFor(fc => fc.ComentarioEsfa).MaximumLength(500);
            RuleFor(fc => fc.ComentarioEra).MaximumLength(500);
            RuleFor(fc => fc.ComentarioFcd).MaximumLength(500);
            RuleFor(fc => fc.ComentarioRse).MaximumLength(500);
            //porcentajes
            RuleFor(fc => fc.SVRendimiento).InclusiveBetween(-50, 50);
            RuleFor(fc => fc.SVCosto).InclusiveBetween(-50, 50);
            RuleFor(fc => fc.SVPrecio).InclusiveBetween(-50, 50);
        }
        private void RulesForEsfa()
        {
            RuleFor(fc => fc.Esfa).Must(esfa => esfa != null && esfa.Count > 0)
                   .WithMessage("Debe tener al menos un Estado de situación Financiera.");

            RuleForEach(fc => fc.Esfa).SetValidator(new FlujoCajaEsfaValidator());

            RuleFor(fc => fc.Esfa.First(i => i.CodItem == Esfa.TOTAL_ACTIVO).MontoActual)
                .GreaterThan(0).WithMessage("ESFA: Total Activo del debe ser mayor a 0");
        }

        private void RulesForFcd()
        {
            RuleFor(fc => fc.FCDetalle).Must(fcd => fcd != null && fcd.Count > 0)
                 .WithMessage("Debe tener al menos un Flujo de Caja Detalle.");

            RuleForEach(fc => fc.FCDetalle).SetValidator(new FlujoCajaDetalleValidator());
            
            RuleFor(fc => fc.PlanDR).Must(pdr => pdr != null && pdr.Sum(pdr => pdr.Porcentaje) == 100)
              .WithMessage("La sumatoria de la columna % desembolso debe ser 100%");

            RuleFor(fc => fc.PlanDR.Count).InclusiveBetween(1, 4)
              .WithMessage("El plan de desembolso debe ser entre 1 y 4 como maximo");

            RuleFor(fc => fc.DeudaPD).Must(dpd => dpd != null && dpd.Count > 0 )
              .WithMessage("Debe tener al menos una Deuda Potencial Directa.");

            RuleForEach(fc => fc.DeudaPD).SetValidator(new FlujoCajaDpdValidator());

            RuleFor(fc => fc.DeudaPI).Must(dpi => dpi != null && dpi.Count > 0)
              .WithMessage("Debe tener al menos una Deuda Potencial Indirecta.");

            RuleForEach(fc => fc.DeudaPI).SetValidator(new FlujoCajaDpiValidator());
        }
    }
}
