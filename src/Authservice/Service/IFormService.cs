using Authservice.DTOs.Form;
using Authservice.Models;

namespace Authservice.Service;

public interface IFormService
{
    Task<FormResponseDTO> CreateFormAsync(CreateFormDTO dto);

    Task<FormResponseDTO?> GetFormAsync(Guid id);

    Task<FormResponseDTO?> UpdateFormAsync(Guid id, UpdateFormDTO dto);

    Task<bool> DeleteFormAsync(Guid id);

    Task<List<FormResponseDTO>> GetAllFormsAsync();

    // =========================
    // USER-SPECIFIC METHODS
    // =========================
    Task<List<FormResponseDTO>> GetAvailableFormsAsync(string email);

    Task<List<FormResponseDTO>> GetFilledFormsAsync(string email);

    Task<object> GetUserStatsAsync(string email);
}