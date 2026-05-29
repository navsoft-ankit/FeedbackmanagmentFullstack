using Authservice.DTOs.Form;
using Authservice.Models;

namespace Authservice.Service;

public interface IFormService
{
    Task<FormResponseDTO> CreateFormAsync(CreateFormDTO dto);
    

    Task<FormResponseDTO> GetFormAsync(Guid id);

    Task<FormResponseDTO> UpdateFormAsync(
        Guid id,
        UpdateFormDTO dto
    );

    Task<bool> DeleteFormAsync(Guid id);

    // ADD THIS
    Task<List<FormResponseDTO>> GetAllFormsAsync();
}